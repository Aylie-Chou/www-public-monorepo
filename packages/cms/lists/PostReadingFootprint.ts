import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    user: relationship({
      ui: { label: '使用者' },

      ref: 'User.postReadingFootprint',
    }),
    post: relationship({
      ui: { label: '文章' },

      ref: 'Post',
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
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
    label: 'Post Reading Footprint',
    listView: {
      initialColumns: ['post', 'user', 'updatedAt', 'createdAt'],
      initialSort: { field: 'updatedAt', direction: 'DESC' },
      pageSize: 50,
    },
  },
})
export default listConfigurations
