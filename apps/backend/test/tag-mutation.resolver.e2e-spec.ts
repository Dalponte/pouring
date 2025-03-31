import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateTagInput } from '../../src/tag/dto/create-tag.input';
import { UpdateTagInput } from '../../src/tag/dto/update-tag.input';

describe('TagMutationResolver (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let tagId: number;
    let clientIds: string[] = [];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();
    });

    beforeEach(async () => {
        // Clean up database before each test
        await prisma.tag.deleteMany({});
        await prisma.client.deleteMany({});

        // Create clients for relationship testing
        const client1 = await prisma.client.create({
            data: {
                name: 'Client 1',
                meta: { location: 'New York' }
            }
        });

        const client2 = await prisma.client.create({
            data: {
                name: 'Client 2',
                meta: { location: 'San Francisco' }
            }
        });

        clientIds = [client1.id, client2.id];
    });

    afterAll(async () => {
        await prisma.tag.deleteMany({});
        await prisma.client.deleteMany({});
        await app.close();
    });

    it('should create a tag', async () => {
        // Create a tag input following the DTO structure
        const createTagInput: CreateTagInput = {
            code: "TEST01",
            reference: "Test Reference",
            meta: { testKey: "testValue" }
        };

        const createTagMutation = `
            mutation CreateTag($input: CreateTagInput!) {
                createTag(createTagInput: $input) {
                    id
                    code
                    reference
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
                query: createTagMutation,
                variables: {
                    input: createTagInput
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.createTag).toBeDefined();
        expect(response.body.data.createTag.code).toBe(createTagInput.code);
        expect(response.body.data.createTag.reference).toBe(createTagInput.reference);
        expect(response.body.data.createTag.meta).toEqual(createTagInput.meta);
        expect(response.body.data.createTag.deletedAt).toBeNull();

        tagId = response.body.data.createTag.id;
    });

    it('should update a tag', async () => {
        // First create a tag to update
        const tag = await prisma.tag.create({
            data: {
                code: 'ORIGINAL',
                reference: 'Original Reference',
                meta: {}
            }
        });

        // Update tag input following the DTO structure
        const updateTagInput: UpdateTagInput = {
            code: "UPDATED01",
            reference: "Updated Reference",
            meta: { updatedKey: "updatedValue" }
        };

        const updateTagMutation = `
            mutation UpdateTag($id: Int!, $input: UpdateTagInput!) {
                updateTag(
                    id: $id, 
                    updateTagInput: $input
                ) {
                    id
                    code
                    reference
                    meta
                    updatedAt
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: updateTagMutation,
                variables: {
                    id: tag.id,
                    input: updateTagInput
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updateTag).toBeDefined();
        expect(response.body.data.updateTag.code).toBe(updateTagInput.code);
        expect(response.body.data.updateTag.reference).toBe(updateTagInput.reference);
        expect(response.body.data.updateTag.meta).toEqual(updateTagInput.meta);
    });

    it('should soft delete a tag', async () => {
        // First create a tag to delete
        const tag = await prisma.tag.create({
            data: {
                code: 'DELETE_ME',
                reference: 'To Be Deleted',
                meta: {}
            }
        });

        const deleteTagMutation = `
            mutation DeleteTag($id: Int!) {
                deleteTag(id: $id) {
                    id
                    code
                    deletedAt
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: deleteTagMutation,
                variables: {
                    id: tag.id
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.deleteTag).toBeDefined();
        expect(response.body.data.deleteTag.id).toBe(tag.id);
        expect(response.body.data.deleteTag.deletedAt).not.toBeNull();
    });

    it('should add clients to tag', async () => {
        // Create a tag for client relationship testing
        const relationTag = await prisma.tag.create({
            data: {
                code: 'RELATION01',
                reference: 'Relation Test Tag',
                meta: { purpose: 'Client relationship testing' }
            }
        });

        // Add first client
        let addClientMutation = `
            mutation AddClientToTag($tagId: Int!, $clientId: String!) {
                addClientToTag(tagId: $tagId, clientId: $clientId) {
                    id
                    code
                    clients {
                        id
                        name
                    }
                }
            }
        `;

        let response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: addClientMutation,
                variables: {
                    tagId: relationTag.id,
                    clientId: clientIds[0]
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addClientToTag.clients).toHaveLength(1);
        expect(response.body.data.addClientToTag.clients[0].id).toBe(clientIds[0]);

        // Add second client
        response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: addClientMutation,
                variables: {
                    tagId: relationTag.id,
                    clientId: clientIds[1]
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.addClientToTag.clients).toHaveLength(2);
        expect(response.body.data.addClientToTag.clients.map(c => c.id)).toContain(clientIds[1]);
    });

    it('should remove a client from tag', async () => {
        // Create a tag and connect two clients
        const relationTag = await prisma.tag.create({
            data: {
                code: 'RELATION02',
                reference: 'Relation Test Tag',
                meta: {},
                clients: {
                    connect: [
                        { id: clientIds[0] },
                        { id: clientIds[1] }
                    ]
                }
            }
        });

        const removeClientMutation = `
            mutation RemoveClientFromTag($tagId: Int!, $clientId: String!) {
                removeClientFromTag(tagId: $tagId, clientId: $clientId) {
                    id
                    code
                    clients {
                        id
                        name
                    }
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: removeClientMutation,
                variables: {
                    tagId: relationTag.id,
                    clientId: clientIds[0]
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data.removeClientFromTag.clients).toHaveLength(1);
        expect(response.body.data.removeClientFromTag.clients[0].id).toBe(clientIds[1]);
    });
});
