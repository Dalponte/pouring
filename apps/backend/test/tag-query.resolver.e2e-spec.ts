import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('TagQueryResolver (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let tagId: number;
    let relationTagId: number;

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

        // Create test tags for querying
        const testTag = await prisma.tag.create({
            data: {
                code: 'TEST01',
                reference: 'Test Reference',
                meta: { testKey: 'testValue' }
            }
        });
        tagId = testTag.id;

        const relationTag = await prisma.tag.create({
            data: {
                code: 'RELATION01',
                reference: 'Relation Test Tag',
                meta: { purpose: 'Client relationship testing' }
            }
        });
        relationTagId = relationTag.id;

        // Create client and link to relation tag for testing tag-client relationships
        const client = await prisma.client.create({
            data: {
                name: 'Test Client',
                meta: {},
                tags: {
                    connect: { id: relationTagId }
                }
            }
        });
    });

    afterAll(async () => {
        await prisma.tag.deleteMany({});
        await prisma.client.deleteMany({});
        await app.close();
    });

    it('should get a tag by id', async () => {
        const getTagQuery = `
            query {
                getTag(id: ${tagId}) {
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
                query: getTagQuery,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getTag).toBeDefined();
        expect(response.body.data.getTag.id).toBe(tagId);
        expect(response.body.data.getTag.code).toBe('TEST01');
        expect(response.body.data.getTag.reference).toBe('Test Reference');
    });

    it('should get all tags', async () => {
        const getTagsQuery = `
            query {
                getTags {
                    id
                    code
                    reference
                    meta
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: getTagsQuery,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getTags).toBeDefined();
        expect(response.body.data.getTags.length).toBeGreaterThanOrEqual(2);
    });

    it('should not return deleted tags in normal query', async () => {
        // First soft-delete a tag
        await prisma.tag.update({
            where: { id: tagId },
            data: { deletedAt: new Date() }
        });

        const getTagsQuery = `
            query {
                getTags {
                    id
                    code
                }
            }
        `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: getTagsQuery,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getTags).toBeDefined();

        const foundDeletedTag = response.body.data.getTags.find(tag => tag.id === tagId);
        expect(foundDeletedTag).toBeUndefined();
    });

    it('should get tag with clients', async () => {
        const query = `
            query {
                getTag(id: ${relationTagId}) {
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
                query,
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getTag.clients).toHaveLength(1);
    });
});
