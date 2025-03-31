import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ClientResolver (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let clientId: string;
  let tagIds: number[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up database before tests
    await prisma.client.deleteMany({});
    await prisma.tag.deleteMany({});
  });

  afterAll(async () => {
    await prisma.client.deleteMany({});
    await prisma.tag.deleteMany({});
    await app.close();
  });

  it('should create a client', async () => {
    const createClientMutation = `
      mutation {
        createClient(createClientInput: {
          name: "Test Client",
          meta: { contactPerson: "John Doe", phoneNumber: "555-1234" }
        }) {
          id
          name
          meta
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createClientMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createClient).toBeDefined();
    expect(response.body.data.createClient.name).toBe('Test Client');
    expect(response.body.data.createClient.meta).toEqual({
      contactPerson: 'John Doe',
      phoneNumber: '555-1234'
    });
    expect(response.body.data.createClient.deletedAt).toBeNull();

    clientId = response.body.data.createClient.id;
  });

  it('should get a client by id', async () => {
    const getClientQuery = `
      query {
        getClient(id: "${clientId}") {
          id
          name
          meta
          createdAt
          updatedAt
          deletedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getClientQuery,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getClient).toBeDefined();
    expect(response.body.data.getClient.id).toBe(clientId);
    expect(response.body.data.getClient.name).toBe('Test Client');
  });

  it('should get all clients', async () => {
    const getClientsQuery = `
      query {
        getClients {
          id
          name
          meta
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getClientsQuery,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getClients).toBeDefined();
    expect(response.body.data.getClients.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a client', async () => {
    const updateClientMutation = `
      mutation {
        updateClient(
          id: "${clientId}", 
          updateClientInput: {
            name: "Updated Client",
            meta: { contactPerson: "Jane Smith", phoneNumber: "555-5678" }
          }
        ) {
          id
          name
          meta
          updatedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: updateClientMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.updateClient).toBeDefined();
    expect(response.body.data.updateClient.name).toBe('Updated Client');
    expect(response.body.data.updateClient.meta).toEqual({
      contactPerson: 'Jane Smith',
      phoneNumber: '555-5678'
    });
  });

  it('should soft delete a client', async () => {
    const deleteClientMutation = `
      mutation {
        deleteClient(id: "${clientId}") {
          id
          name
          deletedAt
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: deleteClientMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteClient).toBeDefined();
    expect(response.body.data.deleteClient.id).toBe(clientId);
    expect(response.body.data.deleteClient.deletedAt).not.toBeNull();
  });

  it('should not return deleted clients in normal query', async () => {
    const getClientsQuery = `
      query {
        getClients {
          id
          name
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: getClientsQuery,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getClients).toBeDefined();

    const foundDeletedClient = response.body.data.getClients.find(client => client.id === clientId);
    expect(foundDeletedClient).toBeUndefined();
  });

  it('should create a new client for the relationship testing', async () => {
    const createClientMutation = `
      mutation {
        createClient(createClientInput: {
          name: "Relation Test Client",
          meta: { purpose: "Tag relationship testing" }
        }) {
          id
          name
          meta
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createClientMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.createClient).toBeDefined();
    expect(response.body.data.createClient.name).toBe('Relation Test Client');

    clientId = response.body.data.createClient.id;
  });

  it('should create multiple tags for testing', async () => {
    // Create first tag
    let createTagMutation = `
      mutation {
        createTag(createTagInput: {
          code: "TAG1",
          reference: "First Tag",
          meta: { order: 1 }
        }) {
          id
          code
        }
      }
    `;

    let response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createTagMutation,
      });

    expect(response.status).toBe(200);
    tagIds.push(response.body.data.createTag.id);

    // Create second tag
    createTagMutation = `
      mutation {
        createTag(createTagInput: {
          code: "TAG2",
          reference: "Second Tag",
          meta: { order: 2 }
        }) {
          id
          code
        }
      }
    `;

    response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createTagMutation,
      });

    expect(response.status).toBe(200);
    tagIds.push(response.body.data.createTag.id);
  });

  it('should add tags to client', async () => {
    let addTagMutation = `
      mutation {
        addTagToClient(clientId: "${clientId}", tagId: ${tagIds[0]}) {
          id
          name
          tags {
            id
            code
          }
        }
      }
    `;

    let response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: addTagMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.addTagToClient.tags).toHaveLength(1);
    expect(response.body.data.addTagToClient.tags[0].id).toBe(tagIds[0]);

    // Add second tag
    addTagMutation = `
      mutation {
        addTagToClient(clientId: "${clientId}", tagId: ${tagIds[1]}) {
          id
          name
          tags {
            id
            code
          }
        }
      }
    `;

    response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: addTagMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.addTagToClient.tags).toHaveLength(2);
    expect(response.body.data.addTagToClient.tags[1].id).toBe(tagIds[1]);
  });

  it('should get client with tags', async () => {
    const query = `
      query {
        getClient(id: "${clientId}") {
          id
          name
          tags {
            id
            code
            reference
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getClient.tags).toHaveLength(2);
  });

  it('should remove a tag from client', async () => {
    const removeTagMutation = `
      mutation {
        removeTagFromClient(clientId: "${clientId}", tagId: ${tagIds[0]}) {
          id
          name
          tags {
            id
            code
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: removeTagMutation,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.removeTagFromClient.tags).toHaveLength(1);
    expect(response.body.data.removeTagFromClient.tags[0].id).toBe(tagIds[1]);
  });
});
