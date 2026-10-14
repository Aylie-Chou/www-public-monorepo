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
      ui: { label: '次類別中文名稱' },
      isIndexed: 'unique',

      validation: { isRequired: true },
    }),
    category: relationship({
      ui: { label: 'Category' },
      ref: 'Category.subcategories',
      many: false,

      hooks: {
        validate: ({ operation, addValidationError, resolvedData, item }) => {
          if (operation === 'delete') return
          const { category } = resolvedData
          if (!item?.categoryId && !category) addValidationError('分類為必填')
        },
      },
    }),
    nameForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item, context }) => {
          const { category, name } = resolvedData

          const fetchCategoryName = async (id: NonNullable<unknown>) => {
            const categoryItem = await context.query.Category.findOne({
              where: { id: Number(id) },
              query: 'name',
            })
            return categoryItem?.name
          }
          let categoryName = ''
          if (category?.connect?.id) {
            categoryName = await fetchCategoryName(category.connect.id)
          } else if (item?.categoryId) {
            categoryName = await fetchCategoryName(item.categoryId)
          }
          const subcategoryName = name || item?.name
          return subcategoryName && categoryName
            ? `${subcategoryName} | ${categoryName}`
            : resolvedData.nameForCMS
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
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
      ref: 'Post.subcategories',
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
    label: 'Subcategories',
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
