import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, SLUG, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    slug: SLUG,
    name: text({
      ui: { label: '標籤名稱' },
      isIndexed: 'unique',

      validation: { isRequired: true },
    }),
    ogTitle: text({ ui: { label: 'og:title' } }),
    ogDescription: text({ ui: { label: 'og:description' } }),
    ogImage: relationship({
      ref: 'Photo',

      ui: { label: 'og:image', labelField: 'name' },
    }),
    posts: relationship({
      ref: 'Post.tags',
      many: true,

      ui: { label: '相關文章', hideCreate: true, labelField: 'title' },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([
        RoleEnum.Owner,
        RoleEnum.Admin,
        RoleEnum.Editor,
        RoleEnum.Contributor,
      ]),
      update: allowRoles([
        RoleEnum.Owner,
        RoleEnum.Admin,
        RoleEnum.Editor,
        RoleEnum.Contributor,
      ]),
      delete: allowRoles([
        RoleEnum.Owner,
        RoleEnum.Admin,
        RoleEnum.Editor,
        RoleEnum.Contributor,
      ]),
    },
  },
  ui: {
    label: 'Tags',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
  },
})
export default listConfigurations
