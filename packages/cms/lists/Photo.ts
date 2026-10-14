import { g as graphql, list } from '@keystone-6/core'
import {
  image,
  json,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-6/core/fields'
import ExifReader from 'exifreader'
import get from 'lodash/get'
import envVar from '../environment-variables'
import { imageStorage } from '../storage'
import {
  allowAllRoles,
  allowRoles,
  denyRoles,
  RoleEnum,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const _ = {
  get,
}

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
  hooks: {
    resolveInput: async ({ resolvedData, context }) => {
      if (resolvedData?.imageFile?.id && resolvedData?.imageFile?.extension) {
        const tags = await ExifReader.load(
          `${envVar.gcs.origin}${envVar.images.baseUrl}/${resolvedData.imageFile.id}.${resolvedData.imageFile.extension}`
        )
        const keywordsString =
          tags?.Keywords && Array.isArray(tags.Keywords)
            ? tags.Keywords.map(({ description }) => description).join(';')
            : ''
        const author = tags?.Artist?.description || ''
        resolvedData.IPTC = {
          author,
          description: tags?.ImageDescription?.description || '',
          keywords: keywordsString,
          dateCreated: tags?.DateCreated?.description || '',
        }
        resolvedData.keywords = keywordsString

        if (author) {
          const { graphql } = context
          const query = `query ExampleQuery($where: AuthorWhereInput!) {
            authors(where: $where) {
              id,
            }
          }`
          const variables = { where: { name: { equals: author } } }
          const data = await graphql.run({ query, variables })
          const queriedAuthors = _.get(data, 'authors', [])
          if (queriedAuthors.length > 0) {
            const { id } = queriedAuthors[0]
            resolvedData.authors = { connect: [{ id: parseInt(id) }] }
          }
        }
      }
      return resolvedData
    },
  },
  fields: {
    name: text({
      ui: { label: '標題' },

      validation: { isRequired: true },
      isIndexed: true,
    }),
    imageFile: image({
      storage: imageStorage,
    }),
    authors: relationship({
      ref: 'Author',
      many: true,

      ui: { label: '作者', labelField: 'name' },
    }),
    IPTC: json({
      ui: {
        itemView: {
          fieldMode: 'read',
        },
        createView: {
          fieldMode: 'hidden',
        },
        views: './lists/views/IPTC',
      },
    }),
    copyright: select({
      options: [
        { label: 'Copyrighted', value: 'copyrighted' },
        { label: 'Creative Commons', value: 'cc' },
        { label: '外部提供 - 可永久使用', value: 'external-forever' },
        { label: '外部提供 - 一次性使用', value: 'external-onetime' },
      ],
      defaultValue: 'copyrighted',
    }),
    keywords: text({
      validation: { isRequired: false },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    resized: virtual({
      field: graphql.field({
        type: graphql.object<{
          original: string
          large: string
          medium: string
          small: string
          tiny: string
        }>()({
          name: 'ResizedImages',
          fields: {
            original: graphql.field({ type: graphql.String }),
            large: graphql.field({ type: graphql.String }),
            medium: graphql.field({ type: graphql.String }),
            small: graphql.field({ type: graphql.String }),
            tiny: graphql.field({ type: graphql.String }),
          },
        }),
        resolve(item: Record<string, unknown>) {
          const empty = {
            original: '',
            large: '',
            medium: '',
            small: '',
            tiny: '',
          }

          // For backward compatibility,
          // this image item is uploaded via `GCSFile` custom field.
          if (item?.urlOriginal) {
            return Object.assign(empty, {
              original: item.urlOriginal,
            })
          }

          const rtn: Record<string, string> = {}
          const filename = item?.imageFile_id

          if (!filename) {
            return empty
          }

          const extension = item?.imageFile_extension
            ? `.${item.imageFile_extension}`
            : ''

          const resizedTargets = {
            large: 2000,
            medium: 1200,
            small: 800,
            tiny: 400,
          }

          Object.entries(resizedTargets).forEach(([key, value]) => {
            rtn[key] =
              `${envVar.gcs.origin}${envVar.images.resizedUrl}/${filename}-${value}.webp`
          })

          rtn.original = `${envVar.gcs.origin}${envVar.images.baseUrl}/${filename}${extension}`
          return Object.assign(empty, rtn)
        },
      }),
      ui: {
        query: '{ original large medium small tiny }',
        views: './lists/views/resized-image',
      },
    }),
  },
  ui: {
    hideNavigation: denyRoles([
      RoleEnum.Owner,
      RoleEnum.Admin,
      RoleEnum.Editor,
      RoleEnum.Contributor,
    ]),
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
    label: 'Photos',
    labelField: 'name',
    listView: {
      initialColumns: ['name'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
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
