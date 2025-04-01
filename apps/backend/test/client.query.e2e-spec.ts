import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateClientInput } from '../src/client/dto/create-client.input';

describe('ClientQueryResolver (e2e)', () => {
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

        // Create a test client for all query tests
        const createClientInput: CreateClientInput = {
            name: 'Test Client',
            meta: { contactPerson: 'John Doe', phoneNumber: '555-1234' }
        };

        const createClientMutation = `
      mutation CreateClient($input: CreateClientInput!) {
        createClient(createClientInput: $input) {
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
                variables: { input: createClientInput }
            });

        clientId = response.body.data.createClient.id;

        // Create test tags
        const createTagMutation = `
      mutation CreateTag($code: String!, $reference: String!, $meta: JSON) {
        createTag(createTagInput: {
          code: $code,
          reference: $reference,
          meta: $meta
        }) {
          id
          code
        }
      }
    `;

        // Create two tags
        const tagResponses = await Promise.all([
            request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: createTagMutation,
                    variables: {
                        code: "TAG1",
                        reference: "First Tag",
                        meta: { order: 1 }
                    }
                }),
            request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: createTagMutation,
                    variables: {
                        code: "TAG2",
                        reference: "Second Tag",
                        meta: { order: 2 }
                    }
                })
        ]);

        tagIds = tagResponses.map(resp => resp.body.data.createTag.id);

        // Add tags to client
        const addTagMutation = `
      mutation AddTagToClient($clientId: String!, $code: String!) {
        addTagToClientByCode(clientId: $clientId, code: $code) {
          id
        }
      }
    `;

        await Promise.all([
            request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: addTagMutation,
                    variables: { clientId, code: "TAG1" }
                }),
            request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: addTagMutation,
                    variables: { clientId, code: "TAG2" }
                })
        ]);
    });

    afterAll(async () => {
        await prisma.client.deleteMany({});
        await prisma.tag.deleteMany({});
        await app.close();
    });

    it('should get a client by id', async () => {
        const getClientQuery = `
      query GetClient($id: String!) {
        getClient(id: $id) {
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
                variables: { id: clientId }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getClient).toBeDefined();
        expect(response.body.data.getClient.id).toBe(clientId);
        expect(response.body.data.getClient.name).toBe('Test Client');
    });

    it('should get all clients', async () => {
        const getClientsQuery = `
      query GetClients {
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
                query: getClientsQuery
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getClients).toBeDefined();
        expect(response.body.data.getClients.length).toBeGreaterThanOrEqual(1);
    });

    it('should get client with tags', async () => {
        const query = `
      query GetClientWithTags($id: String!) {
        getClient(id: $id) {
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
                variables: { id: clientId }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getClient.tags).toHaveLength(2);
    });

    it('should not return deleted clients in normal query', async () => {
        // First, delete a client
        const deleteClientMutation = `
      mutation DeleteClient($id: String!) {
        deleteClient(id: $id) {
          id
        }
      }
    `;

        await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: deleteClientMutation,
                variables: { id: clientId }
            });

        // Then try to retrieve it
        const getClientsQuery = `
      query GetClients {
        getClients {
          id
          name
        }
      }
    `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: getClientsQuery
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getClients).toBeDefined();

        const foundDeletedClient = response.body.data.getClients.find(client => client.id === clientId);
        expect(foundDeletedClient).toBeUndefined();
    });
});
