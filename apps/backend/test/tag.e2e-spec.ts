import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TagResolver (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let tagId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();

        // Clean up database before tests
        await prisma.tag.deleteMany({});
    });

    afterAll(async () => {
        await prisma.tag.deleteMany({});
        await app.close();
    });

    it('should create a tag', async () => {
        const createTagMutation = `
      mutation {
        createTag(createTagInput: {
          code: "TEST01",
          reference: "Test Reference",
          meta: { testKey: "testValue" }
        }) {
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
            });

        expect(response.status).toBe(200);
        expect(response.body.data.createTag).toBeDefined();
        expect(response.body.data.createTag.code).toBe('TEST01');
        expect(response.body.data.createTag.reference).toBe('Test Reference');
        expect(response.body.data.createTag.meta).toEqual({ testKey: 'testValue' });
        expect(response.body.data.createTag.deletedAt).toBeNull(); // Check deletedAt is null on creation

        tagId = response.body.data.createTag.id;
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
        expect(response.body.data.getTags.length).toBeGreaterThanOrEqual(1);
    });

    it('should update a tag', async () => {
        const updateTagMutation = `
      mutation {
        updateTag(
          id: ${tagId}, 
          updateTagInput: {
            code: "UPDATED01",
            reference: "Updated Reference",
            meta: { updatedKey: "updatedValue" }
          }
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
            });

        expect(response.status).toBe(200);
        expect(response.body.data.updateTag).toBeDefined();
        expect(response.body.data.updateTag.code).toBe('UPDATED01');
        expect(response.body.data.updateTag.reference).toBe('Updated Reference');
        expect(response.body.data.updateTag.meta).toEqual({ updatedKey: 'updatedValue' });
    });

    it('should soft delete a tag', async () => {
        const deleteTagMutation = `
      mutation {
        deleteTag(id: ${tagId}) {
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
            });

        expect(response.status).toBe(200);
        expect(response.body.data.deleteTag).toBeDefined();
        expect(response.body.data.deleteTag.id).toBe(tagId);
        expect(response.body.data.deleteTag.deletedAt).not.toBeNull(); // Check deletedAt is set after deletion
    });

    it('should not return deleted tags in normal query', async () => {
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
});
