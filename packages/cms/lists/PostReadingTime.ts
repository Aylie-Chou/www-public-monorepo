import { list } from '@keystone-6/core'
import { integer, relationship } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'

const listConfigurations = list({
  fields: {
    user: relationship({
      ui: { label: '使用者' },

      ref: 'User.postReadingTime',
    }),
    post: relationship({
      ui: { label: '文章' },

      ref: 'Post',
    }),
    seconds: integer({
      ui: { label: '秒數' },

      defaultValue: 0,
      validation: { min: 0, isRequired: true },
    }),
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowAllRoles(),
      update: allowAllRoles(),
      delete: allowAllRoles(),
    },
  },
  ui: {
    label: 'Post Reading Time',
    listView: {
      initialColumns: ['post', 'user', 'seconds'],
      initialSort: { field: 'seconds', direction: 'DESC' },
      pageSize: 50,
    },
  },
})
export default listConfigurations
