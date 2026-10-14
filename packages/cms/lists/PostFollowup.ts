import { list } from '@keystone-6/core'
import { json, relationship, text, timestamp } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  denyRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fieldDefaults: {
    ui: {
      itemView: {
        fieldMode: ({ session }) => {
          if (
            [
              RoleEnum.Owner,
              RoleEnum.Admin,
              RoleEnum.Editor,
              RoleEnum.Contributor,
            ].indexOf(session?.data.role) > -1
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
    title: text({
      ui: { label: '標題' },
      isIndexed: true,

      validation: { isRequired: true },
    }),
    publishedDate: timestamp({ ui: { label: '發布時間' }, isIndexed: true }),
    summary: text({ ui: { label: '摘要' } }),
    content: json({
      ui: {
        label: '內容',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    posts: relationship({
      ref: 'Post.postFollowups',
      many: true,

      ui: { label: '關聯文章', hideCreate: true, labelField: 'title' },
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
    label: 'Post Followups',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'summary', 'publishedDate'],
      initialSort: { field: 'publishedDate', direction: 'DESC' },
      pageSize: 50,
    },
    hideCreate: denyRoles([
      RoleEnum.Owner,
      RoleEnum.Admin,
      RoleEnum.Editor,
      RoleEnum.Contributor,
    ]),
    hideDelete: denyRoles([
      RoleEnum.Owner,
      RoleEnum.Admin,
      RoleEnum.Editor,
      RoleEnum.Contributor,
    ]),
  },
})
export default listConfigurations
