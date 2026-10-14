import { g as graphql } from '@keystone-6/core'
import {
  type BaseListTypeInfo,
  type CommonFieldConfig,
  type SimpleFieldTypeInfo,
  type FieldTypeFunc,
  fieldType,
  orderDirectionEnum,
} from '@keystone-6/core/types'

type ColorFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo, SimpleFieldTypeInfo<'String'>> & {
    isIndexed?: boolean | 'unique'
  }

export function color<ListTypeInfo extends BaseListTypeInfo>({
  isIndexed,
  ...config
}: ColorFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> {
  return () =>
    fieldType({
      kind: 'scalar',
      mode: 'optional',
      scalar: 'String',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
    })({
      ...config,
      input: {
        create: {
          arg: graphql.arg({ type: graphql.String }),
          resolve(value) {
            return value
          },
        },
        update: { arg: graphql.arg({ type: graphql.String }) },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({
        type: graphql.String,
        resolve({ value }) {
          return value
        },
      }),
      views: './lists/views/color-picker',
      getAdminMeta() {
        return {}
      },
    })
}
