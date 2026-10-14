import type { Context } from './generated/keystone/types'
import Path from 'node:path'
import express from 'express'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { mergeSchemas } from '@graphql-tools/schema'
import { config } from '@keystone-6/core'
import { session, withAuth } from './auth'
import envVars from './environment-variables'
import { listDefinition as lists } from './lists'
import { getEditorStyleFiles } from './admin/editor-style-files'

type LatestCreateInput = {
  tag: {
    connect: {
      id: string
    }
  }
  order: number
}

type LatestWhereUniqueInput = {
  id: string
}

type ReviewCreateInput = {
  post: {
    connect: {
      id: string
    }
  }
  order: number
}

type ReviewWhereUniqueInput = {
  id: string
}

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      prismaClientOptions: () => ({
        adapter: new PrismaMariaDb(envVars.database.url),
      }),
      idField: {
        kind: 'autoincrement',
      },
    },
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
      getAdditionalFiles: async () => [
        ...(await getEditorStyleFiles()),
        {
          mode: 'copy',
          inputPath: Path.resolve('public/asset/favicon.ico'),
          outputPath: 'public/favicon.ico',
        },
      ],
    },
    lists,
    session,
    server: {
      extendExpressApp: (app) => {
        app.use('/images', express.static(envVars.images.storagePath))
      },
    },
    graphql: {
      bodyParser: {
        limit: '10mb',
      },
      extendGraphqlSchema: (schema) =>
        mergeSchemas({
          schemas: [schema],
          typeDefs: `
            type Mutation {
              deleteAllLatestAndBulkCreate(deleteCondition: [LatestWhereUniqueInput!]!, createData: [LatestCreateInput!]!): [Latest!]!
              deleteAllReviewsAndBulkCreate(deleteCondition: [ReviewWhereUniqueInput!]!, createData: [ReviewCreateInput!]!): [Review!]!
            }
          `,
          resolvers: {
            Mutation: {
              deleteAllLatestAndBulkCreate: async (
                _root,
                {
                  deleteCondition,
                  createData,
                }: {
                  deleteCondition: LatestWhereUniqueInput[]
                  createData: LatestCreateInput[]
                },
                context: Context
              ) => {
                await context.transaction(async (tx) => {
                  await tx.db.Latest.deleteMany({ where: deleteCondition })
                  await tx.db.Latest.createMany({ data: createData })
                })
                return await context.db.Latest.findMany({ where: { OR: [] } })
              },
              deleteAllReviewsAndBulkCreate: async (
                _root,
                {
                  deleteCondition,
                  createData,
                }: {
                  deleteCondition: ReviewWhereUniqueInput[]
                  createData: ReviewCreateInput[]
                },
                context: Context
              ) => {
                await context.transaction(async (tx) => {
                  await tx.db.Review.deleteMany({ where: deleteCondition })
                  await tx.db.Review.createMany({ data: createData })
                })
                return await context.db.Review.findMany({ where: { OR: [] } })
              },
            },
          },
        }),
    },
  })
)
