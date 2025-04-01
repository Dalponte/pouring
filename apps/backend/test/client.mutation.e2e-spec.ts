import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateClientInput } from '../src/client/dto/create-client.input';
import { UpdateClientInput } from '../src/client/dto/update-client.input';

describe('ClientMutationResolver (e2e)', () => {
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
                variables: { input: createClientInput }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.createClient).toBeDefined();
        expect(response.body.data.createClient.name).toBe(createClientInput.name);
        expect(response.body.data.createClient.meta).toEqual(createClientInput.meta);
        expect(response.body.data.createClient.deletedAt).toBeNull();

        clientId = response.body.data.createClient.id;
    });

    it('should update a client', async () => {
        const updateClientInput: UpdateClientInput = {
            name: 'Updated Client',
            meta: { contactPerson: 'Jane Smith', phoneNumber: '555-5678' }
        };

        const updateClientMutation = `
      mutation UpdateClient($id: String!, $input: UpdateClientInput!) {
        updateClient(
          id: $id, 
          updateClientInput: $input
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
                variables: {
                    id: clientId,
                    input: updateClientInput
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updateClient).toBeDefined();
        expect(response.body.data.updateClient.name).toBe(updateClientInput.name);
        expect(response.body.data.updateClient.meta).toEqual(updateClientInput.meta);
    });

    it('should soft delete a client', async () => {
        const deleteClientMutation = `
      mutation DeleteClient($id: String!) {
        deleteClient(id: $id) {
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
                variables: { id: clientId }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.deleteClient).toBeDefined();
        expect(response.body.data.deleteClient.id).toBe(clientId);
        expect(response.body.data.deleteClient.deletedAt).not.toBeNull();
    });

    it('should create a new client for the relationship testing', async () => {
        const relationClientInput: CreateClientInput = {
            name: 'Relation Test Client',
            meta: { purpose: 'Tag relationship testing' }
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
                variables: { input: relationClientInput }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.createClient).toBeDefined();
        expect(response.body.data.createClient.name).toBe(relationClientInput.name);

        clientId = response.body.data.createClient.id;
    });

    it('should create multiple tags for testing', async () => {
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

        // Create first tag
        let response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: createTagMutation,
                variables: {
                    code: "TAG1",
                    reference: "First Tag",
                    meta: { order: 1 }
                }
            });

        expect(response.status).toBe(200);
        tagIds.push(response.body.data.createTag.id);

        // Create second tag using the same mutation
        response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: createTagMutation,
                variables: {
                    code: "TAG2",
                    reference: "Second Tag",
                    meta: { order: 2 }
                }
            });

        expect(response.status).toBe(200);
        tagIds.push(response.body.data.createTag.id);
    });

    it('should add tags to client', async () => {
        const addTagMutation = `
      mutation AddTagToClient($clientId: String!, $code: String!) {
        addTagToClientByCode(clientId: $clientId, code: $code) {
          id
          name
          tags {
            id
            code
          }
        }
      }
    `;

        // Add first tag
        let response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: addTagMutation,
                variables: {
                    clientId,
                    code: "TAG1"
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addTagToClientByCode.tags).toHaveLength(1);
        expect(response.body.data.addTagToClientByCode.tags[0].code).toBe('TAG1');

        // Add second tag using the same mutation
        response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: addTagMutation,
                variables: {
                    clientId,
                    code: "TAG2"
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addTagToClientByCode.tags).toHaveLength(2);
        expect(response.body.data.addTagToClientByCode.tags[1].code).toBe('TAG2');
    });

    it('should remove a tag from client', async () => {
        const removeTagMutation = `
      mutation RemoveTagFromClient($clientId: String!, $code: String!) {
        removeTagFromClientByCode(clientId: $clientId, code: $code) {
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
                variables: {
                    clientId,
                    code: "TAG1"
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.removeTagFromClientByCode.tags).toHaveLength(1);
        expect(response.body.data.removeTagFromClientByCode.tags[0].code).toBe('TAG2');
    });
});
