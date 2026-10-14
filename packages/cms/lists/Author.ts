import { list } from '@keystone-6/core'
import { relationship, text, json } from '@keystone-6/core/fields'
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
      ui: { label: '作者姓名' },
      isIndexed: true,

      validation: { isRequired: true },
    }),
    email: text(),
    title: text({ ui: { label: '職稱' } }),
    bio: json({
      ui: {
        label: '簡介',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    avatar: relationship({
      ui: { label: '大頭照' },
      ref: 'Photo',
      many: false,
    }),
    ogTitle: text({ ui: { label: 'og:title' } }),
    ogDescription: text({ ui: { label: 'og:description' } }),
    ogImage: relationship({
      ref: 'Photo',

      ui: { label: 'og:image', labelField: 'name' },
    }),
    posts: relationship({
      ref: 'Post.authors',
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
    label: 'Authors',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug', 'email'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
  },
})
export default listConfigurations
