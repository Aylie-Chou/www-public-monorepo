import { list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  denyRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, SLUG, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fieldDefaults: {
    ui: {
      itemView: {
        fieldMode: ({ session }) => {
          if (
            [RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor].indexOf(
              session?.data.role
            ) > -1
          ) {
            return 'edit'
          } else {
            return 'read'
          }
        },
      },
    },
  },
  fields: {
    slug: SLUG,
    name: text({
      ui: { label: '類別中文名稱' },
      isIndexed: 'unique',

      validation: { isRequired: true },
    }),
    subcategories: relationship({
      ui: { label: 'Subcategories' },
      ref: 'Subcategory.category',
      many: true,
    }),
    sortOrder: integer({
      isIndexed: 'unique',

      ui: {
        label: 'Sort Order',
        createView: {
          fieldMode: ({ session }) => {
            if (
              [RoleEnum.Owner, RoleEnum.Admin].indexOf(session?.data.role) > -1
            ) {
              return 'edit'
            } else {
              return 'hidden'
            }
          },
        },
        itemView: {
          fieldMode: ({ session }) => {
            if (
              [RoleEnum.Owner, RoleEnum.Admin].indexOf(session?.data.role) > -1
            ) {
              return 'edit'
            } else {
              return 'read'
            }
          },
        },
      },
    }),
    ogTitle: text({ ui: { label: 'og:title' } }),
    ogDescription: text({ ui: { label: 'og:description' } }),
    ogImage: relationship({
      ref: 'Photo',

      ui: { label: 'og:image', labelField: 'name' },
    }),
    posts: relationship({
      ref: 'Post',
      many: true,

      ui: { label: '相關文章', hideCreate: true, labelField: 'title' },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
  ui: {
    label: 'Categories',
    labelField: 'slug',
    listView: {
      initialColumns: ['slug', 'name', 'sortOrder'],
      initialSort: { field: 'sortOrder', direction: 'ASC' },
      pageSize: 50,
    },
    hideCreate: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    hideDelete: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
  },
})
export default listConfigurations
