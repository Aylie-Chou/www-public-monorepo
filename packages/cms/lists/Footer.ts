import { list } from '@keystone-6/core'
import { text, json } from '@keystone-6/core/fields'
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
    fundraisingID: text({
      ui: { label: '勸募字號' },

      validation: { isRequired: true },
    }),
    fundraisingDateString: text({
      ui: { label: '勸募週期' },

      validation: { isRequired: true },
    }),
    socialMediaLinks: json({
      ui: {
        label: '社群連結列表（最多 6 個）',
        views: './lists/views/footer-social-media-links',
      },
    }),
    footerLinks: json({
      ui: { label: '超連結列表', views: './lists/views/footer-links-columns' },
    }),
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
    label: 'Footer',
    hideCreate: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    hideDelete: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
  },
  isSingleton: true,
})
export default listConfigurations
