import { list } from '@keystone-6/core'
import { integer, relationship } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  denyRoles,
  RoleEnum,
} from './utils/access-control-list'

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
    post: relationship({
      ui: { label: '文章' },

      ref: 'Post',
    }),
    order: integer({ ui: { label: '排序' } }),
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
    label: 'Review',
    hideNavigation: true,
    hideCreate: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    hideDelete: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
  },
})
export default listConfigurations
