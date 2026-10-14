import { list } from '@keystone-6/core'
import {
  json,
  relationship,
  select,
  text,
  timestamp,
} from '@keystone-6/core/fields'
import { get } from 'lodash'
import { color } from '../fields/color-picker'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, SLUG, UPDATED_AT } from './utils/common-field'

const _ = {
  get,
}

const listConfigurations = list({
  fields: {
    slug: SLUG,
    title: text({
      ui: { label: '專題標題' },

      validation: { isRequired: true },
      isIndexed: true,
    }),
    subtitle: text({
      ui: { label: '專題副標' },

      validation: { isRequired: false },
    }),
    headline: text({
      ui: { label: '專題小標' },

      validation: { isRequired: false },
    }),
    topicName: text({
      validation: { isRequired: false },
      ui: {
        label: '文章頁專題標',
        description: '20個全型字以內視覺效果最佳。',
      },
    }),
    titlePosition: select({
      ui: { label: '標題位置' },
      defaultValue: 'bottom',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Bottom Left', value: 'bottom-left' },
      ],
    }),
    state: select({
      ui: { label: '狀態' },

      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
        { label: 'Invisible', value: 'invisible' },
      ],
      defaultValue: 'draft',
      isIndexed: true,
    }),
    publishedDate: timestamp({ ui: { label: '發布時間' }, isIndexed: true }),
    updatedDate: timestamp({ ui: { label: '更新時間' } }),
    description: json({
      ui: {
        label: '簡介',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    teamDescription: json({
      ui: {
        label: '製作人員名單',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    posts: relationship({
      ref: 'Post',
      many: true,

      ui: { label: '相關文章', hideCreate: true },
    }),
    postLayout: select({
      type: 'enum',
      options: [
        { label: 'In Row', value: 'row' },
        { label: 'In Column', value: 'column' },
      ],
      defaultValue: 'row',
      ui: { label: '相關文章版型', views: './lists/views/select-layout' },
    }),
    postBackgroundColor: color({ ui: { label: '文章區背景色' } }),
    heroImage: relationship({ ui: { label: '首圖' }, ref: 'Photo' }),
    mobileHeroImage: relationship({ ui: { label: '手機首圖' }, ref: 'Photo' }),
    ogTitle: text({
      ui: { label: 'og:title' },
      validation: { isRequired: false },
    }),
    ogDescription: text({
      ui: { label: 'og:description' },

      validation: { isRequired: false },
    }),
    ogImage: relationship({ ui: { label: 'og:image' }, ref: 'Photo' }),
    relatedPosts: relationship({
      ref: 'Post.relatedTopics',
      many: true,

      ui: { label: '關聯文章', hideCreate: true },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  hooks: {
    resolveInput: async ({ resolvedData }) => {
      const connectPosts = _.get(resolvedData, ['posts', 'connect'], [])
      const connectRelatedPosts = _.get(
        resolvedData,
        ['relatedPosts', 'connect'],
        []
      )
      let isDirty = false
      connectPosts.forEach(({ id }: { id: number }) => {
        if (
          !connectRelatedPosts.find((post: { id: number }) => post.id === id)
        ) {
          connectRelatedPosts.push({ id })
          isDirty = true
        }
      })

      if (isDirty) {
        resolvedData.relatedPosts = resolvedData.relatedPosts || {}
        resolvedData.relatedPosts.connect = connectRelatedPosts
      }
      return resolvedData
    },
  },
  ui: {
    label: 'Topics',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'state'],
      initialSort: { field: 'publishedDate', direction: 'DESC' },
      pageSize: 50,
    },
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
})

export default listConfigurations
