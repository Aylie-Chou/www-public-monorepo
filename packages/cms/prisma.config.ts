import { defineConfig } from 'prisma/config'
import envVars from './environment-variables'

export default defineConfig({
  schema: 'schema.prisma',
  migrations: { path: 'migrations' },
  datasource: {
    url: envVars.database.url,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})
