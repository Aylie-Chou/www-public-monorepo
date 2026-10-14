import { g as graphql, group, list } from '@keystone-6/core'
import {
  checkbox,
  json,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import {
  allowAllRoles,
  allowRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, SLUG, UPDATED_AT } from './utils/common-field'
import relationshipUtil, {
  type OrderedRelationshipConfig,
} from './utils/manual-order-relationship'

const relatedTopics: OrderedRelationshipConfig = {
  fieldName: 'relatedTopics',
  relationshipConfig: {
    ref: 'Topic.relatedPosts',
    many: true,
    ui: {
      label: '選取',
      hideCreate: true,
    },
  },
  refLabelField: 'title',
}

const subcategories: OrderedRelationshipConfig = {
  fieldName: 'subcategories',
  relationshipConfig: {
    ref: 'Subcategory.posts',
    many: true,
    ui: {
      label: '選取',
      hideCreate: false,
      labelField: 'nameForCMS',
    },
  },
  refLabelField: 'nameForCMS',
}

const tags: OrderedRelationshipConfig = {
  fieldName: 'tags',
  relationshipConfig: {
    ref: 'Tag.posts',
    many: true,
    ui: {
      label: '選取',
      hideCreate: false,
      labelField: 'name',
    },
  },
  refLabelField: 'name',
}

const beenRelatedPosts: OrderedRelationshipConfig = {
  fieldName: 'beenRelatedPosts',
  relationshipConfig: {
    ref: 'Post.relatedPosts',
    many: true,
    ui: {
      label: '選取',
      hideCreate: true,
      labelField: 'title',
    },
  },
  refLabelField: 'title',
}

const relatedPosts: OrderedRelationshipConfig = {
  fieldName: 'relatedPosts',
  relationshipConfig: {
    ref: 'Post.beenRelatedPosts',
    many: true,
    ui: {
      hideCreate: true,
      labelField: 'title',
    },
  },
  refLabelField: 'title',
}

const listConfigurations = list({
  fields: {
    slug: SLUG,
    title: text({
      ui: { label: '標題' },

      validation: { isRequired: true },
      isIndexed: true,
    }),
    subtitle: text({
      ui: { label: '副標' },

      validation: { isRequired: false },
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
    authors: relationship({
      ref: 'Author.posts',
      many: true,

      ui: { label: '作者', labelField: 'name' },
    }),
    authorsJSON: json({
      defaultValue: [],
      ui: {
        label: '作者列',
        views: './lists/views/authorsJSON-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    heroImage: relationship({ ui: { label: '首圖' }, ref: 'Photo' }),
    heroSize: select({
      ui: { label: '首圖尺寸' },

      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Full', value: 'full' },
      ],
      defaultValue: 'medium',
    }),
    heroCaption: text({
      ui: { label: '首圖圖說' },

      validation: { isRequired: false },
    }),
    brief: json({
      ui: {
        label: '前言',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    content: json({
      ui: {
        label: '內文',
        views: './lists/views/wysiwyg-editor',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
    postFollowups: relationship({
      ref: 'PostFollowup.posts',
      many: true,

      ui: { label: '後續追蹤', labelField: 'title' },
    }),
    ...group({
      label: '分類',

      fields: {
        ...relationshipUtil.relationshipAndExtendedFields(subcategories),
      },
    }),
    style: select({
      ui: { label: '文章版式' },

      options: [
        { label: 'Default', value: 'default' },
        { label: 'Photography', value: 'photography' },
        { label: 'Embedded full default', value: 'embedded:full' },
        { label: 'Pink', value: 'pink' },
        { label: 'Series I', value: 'interactive' },
      ],
      defaultValue: 'default',
    }),
    ...group({
      label: '專題',

      fields: {
        ...relationshipUtil.relationshipAndExtendedFields(relatedTopics),
      },
    }),
    copyright: select({
      ui: { label: '版權使用' },

      options: [
        { label: 'Copyrighted', value: 'copyrighted' },
        { label: 'Creative Commons', value: 'cc' },
      ],
      defaultValue: 'copyrighted',
    }),
    ...group({
      label: '標籤',

      fields: {
        ...relationshipUtil.relationshipAndExtendedFields(tags),
      },
    }),
    ...group({
      label: '相關文章',

      fields: {
        ...relationshipUtil.relationshipAndExtendedFields(relatedPosts),
      },
    }),
    reviewWord: text({
      validation: {
        length: {
          max: 18,
        },
      },
      ui: { label: '回顧說明', description: '18 字元以內' },
    }),
    ogTitle: text({
      ui: { label: 'og:title' },
      validation: { isRequired: false },
    }),
    ogDescription: text({
      ui: { label: 'og:description' },

      validation: { isRequired: false },
    }),
    ogImage: relationship({ ui: { label: 'og:image' }, ref: 'Photo' }),
    pushNotifications: relationship({
      ref: 'PushNotification.post',
      many: true,

      ui: { label: '推播', labelField: 'labelForCMS' },
    }),
    newPageTargetBlank: checkbox({
      ui: { label: '另開新頁' },

      defaultValue: false,
    }),
    isFeatured: checkbox({
      ui: { label: '首頁大圖輪播' },

      defaultValue: false,
    }),
    ...group({
      label: '關聯文章',

      fields: {
        ...relationshipUtil.relationshipAndExtendedFields(beenRelatedPosts),
      },
    }),
    postReadingBy: relationship({
      ref: 'User.postReading',
      many: true,
      ui: {
        itemView: {
          fieldMode: 'hidden',
        },
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    preview: virtual({
      field: graphql.field({
        type: graphql.JSON,
        resolve() {
          return {
            href: '',
            label: '文章預覽',
            buttonLabel: 'Preview',
          }
        },
      }),
      ui: {
        // A module path that is resolved from where `keystone start` is run
        views: './lists/views/link-button',
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldPosition: 'sidebar',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
    }),
  },
  ui: {
    label: 'Posts',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'state', 'listPreview'],
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
      delete: allowRoles([RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]),
    },
  },
  hooks: {
    resolveInput: async ({ inputData, item, resolvedData, context }) => {
      await relationshipUtil.mutateOrderFieldHook(relatedTopics)({
        inputData,
        item,
        resolvedData,
        context,
      })

      await relationshipUtil.mutateOrderFieldHook(subcategories)({
        inputData,
        item,
        resolvedData,
        context,
      })

      await relationshipUtil.mutateOrderFieldHook(tags)({
        inputData,
        item,
        resolvedData,
        context,
      })

      await relationshipUtil.mutateOrderFieldHook(beenRelatedPosts)({
        inputData,
        item,
        resolvedData,
        context,
      })

      await relationshipUtil.mutateOrderFieldHook(relatedPosts)({
        inputData,
        item,
        resolvedData,
        context,
      })

      let authorsJSON: AuthorsJSON =
        inputData?.authorsJSON || item?.authorsJSON || []
      authorsJSON = resolveAuthorsJSON(authorsJSON)

      // `authors` is a relationship field.
      // Therefore, `authors` only store author id
      const relationshipAuthors: RelationshipInput = inputData?.authors
      if (relationshipAuthors) {
        const disconnect = relationshipAuthors?.disconnect
        // delete disconnected authors from `authorsJSON`
        if (Array.isArray(disconnect) && disconnect.length > 0) {
          disconnect.forEach(({ id }) => {
            authorsJSON = authorsJSON.filter((item) => {
              // if `item.id` is not existed,
              // which means it is manually added by users,
              // and then we don't filter this item out.
              if (!item.id) {
                return true
              }
              // filter out disconnected item
              return item.id !== id
            })
          })
        }

        // add new connected authors into `authorsJSON`
        const connect = relationshipAuthors?.connect
        if (Array.isArray(connect) && connect.length > 0) {
          const ids = connect.map(({ id }) => id)
          // find author items via gql query
          const items = await context.query.Author.findMany({
            where: { id: { in: ids } },
            query: 'id name',
          })
          items.forEach((item) => {
            authorsJSON.push({
              id: item.id,
              name: item.name,
              type: 'link',
              role: heuristicallyPickRole(item.name),
            })
          })
        }
      }

      resolvedData.authorsJSON = authorsJSON

      return resolvedData
    },
  },
})

/**
 * This function is used to resolve field `authorsJSON`.
 * It filters out invalid data and
 * adds missing properties, such as `type`.
 */
function resolveAuthorsJSON(authorsJSON: AuthorsJSON): AuthorsJSON {
  return authorsJSON
    .filter(
      (item) =>
        typeof item === 'object' &&
        typeof item.name === 'string' &&
        typeof item.role === 'string'
    )
    .map((item) => {
      if (item.id) {
        item.type = 'link'
      } else {
        item.type = 'string'
      }
      return item
    })
}

// TODO: change to reporter version
function heuristicallyPickRole(authorName: string): string {
  switch (authorName) {
    case '陳韻如': {
      return '責任編輯'
    }
    case '邱紹雯':
    case '楊惠君': {
      return '核稿'
    }
    case '王家琛':
    case '黃禹禛':
    case '鄭涵文': {
      return '設計'
    }
    default:
      return '文字'
  }
}

type AuthorsJSON = {
  id?: string
  name: string
  type?: 'link' | 'string'
  role: string
}[]

type RelationshipInput =
  | {
      disconnect?: { id: string }[]
      connect?: { id: string }[]
    }
  | undefined

export default listConfigurations
