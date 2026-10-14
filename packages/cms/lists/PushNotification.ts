import { list } from '@keystone-6/core'
import {
  multiselect,
  relationship,
  text,
  timestamp,
} from '@keystone-6/core/fields'
import requestOrigins from '@twreporter/core/lib/constants/request-origins'
import envVars from '../environment-variables'
import {
  allowAllRoles,
  allowRoles,
  denyRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import { formatDateTime } from './utils/format-time'

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
    title: text({
      ui: { label: '推播標題', createView: { fieldMode: 'hidden' } },
    }),
    link: text({
      ui: { label: '推播連結', createView: { fieldMode: 'hidden' } },
    }),
    labelForCMS: text({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    publishedAt: timestamp({
      ui: { label: '排定推播時間' },

      validation: { isRequired: true },
    }),
    channel: multiselect({
      type: 'string',
      options: [
        {
          label: 'webpush',
          value: 'webpush',
        },
        {
          label: 'telegram',
          value: 'telegram',
        },
      ],
      defaultValue: ['webpush', 'telegram'],
      ui: { label: '推播管道', createView: { fieldMode: 'hidden' } },
    }),
    post: relationship({
      ref: 'Post.pushNotifications',

      ui: {
        label: '關聯文章',
        hideCreate: true,
        labelField: 'title',
        createView: { fieldMode: 'hidden' },
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: 'Push Notifications',
    labelField: 'labelForCMS',
    hideNavigation: denyRoles([
      RoleEnum.Owner,
      RoleEnum.Admin,
      RoleEnum.Editor,
      RoleEnum.Contributor,
    ]),
    hideCreate: true,
    hideDelete: denyRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    listView: {
      initialColumns: ['title', 'publishedAt'],
    },
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      update: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
  hooks: {
    resolveInput: {
      create: async ({ resolvedData, context }) => {
        const url = context.req?.headers.referer
        const postId = url?.split('/').pop()
        if (postId) {
          const postData = await context.query.Post.findOne({
            where: { id: postId },
            query: 'slug title',
          })
          resolvedData.title = postData.title
          resolvedData.link = `${
            requestOrigins.forServerSideRendering[envVars.releaseBranch].main
          }/a/${postData.slug}`
          resolvedData.labelForCMS = `${resolvedData.title} - ${formatDateTime(
            new Date(resolvedData.publishedAt)
          )}`
        }
        return resolvedData
      },
      update: async ({ resolvedData, item }) => {
        const title = resolvedData.title || item.title
        const publishedAt = resolvedData.publishedAt || item.publishedAt
        resolvedData.labelForCMS = `${title} - ${formatDateTime(
          new Date(publishedAt)
        )}`
        return resolvedData
      },
    },
    validate: {
      create: async ({ context, addValidationError }) => {
        const url = context.req?.headers.referer
        const postId = url?.split('/').pop()
        if (!postId) addValidationError('post ID not exist')
      },
      update: async ({ resolvedData, addValidationError }) => {
        // ref: https://regex101.com/r/gilHCG/1
        const regex =
          /^(?<scheme>[a-z][a-z0-9+.-]+):(?<authority>\/\/(?<user>[^@]+@)?(?<host>[a-z0-9.-_~]+)(?<port>:\d+)?)?(?<path>(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])*)*|(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+)*)?(?<query>\?(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?(?<fragment>#(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?$/i
        if (resolvedData?.link && !resolvedData.link.match(regex)) {
          addValidationError('此連結為失效連結，請提供正確的網址。')
        }
      },
    },
  },
})

export default listConfigurations
