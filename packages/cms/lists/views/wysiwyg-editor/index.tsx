import type {
  FieldController,
  FieldControllerConfig,
  FieldProps,
  JSONValue,
} from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '../../../admin/components/controls'
import { useMemo } from 'react'
// lexical
import { LexicalEditor } from '@twreporter/lexical-editor'
import { LexicalBox } from './style'
// config
import createLexicalEditorConfig from './config'
import { getFieldConfig } from './field-config'

type WysiwygFieldController = FieldController<string, string> & {
  listKey: string
}

export const Field = ({
  value,
  field,
  onChange,
}: FieldProps<typeof controller>) => {
  const valueJSON = useMemo(() => (value ? JSON.parse(value) : null), [value])
  const { ContentStyle, mode, features } = getFieldConfig(
    field.listKey,
    field.fieldKey
  )
  const lexicalEditorConfig = useMemo(
    () =>
      createLexicalEditorConfig({ mode, ...(features ? { features } : {}) }),
    [mode, features]
  )

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <LexicalBox id="www-lexical-editor">
        <ContentStyle>
          <LexicalEditor
            value={valueJSON}
            onChange={onChange}
            config={{
              ...lexicalEditorConfig,
              readOnly: !onChange,
            }}
          />
        </ContentStyle>
      </LexicalBox>
    </FieldContainer>
  )
}

type ControllerConfig = FieldControllerConfig<{ defaultValue: JSONValue }>

export const controller = (
  config: ControllerConfig
): WysiwygFieldController => ({
  listKey: config.listKey,
  fieldKey: config.fieldKey,
  label: config.label,
  description: config.description,
  graphqlSelection: config.fieldKey,
  defaultValue:
    config.fieldMeta.defaultValue === null
      ? ''
      : JSON.stringify(config.fieldMeta.defaultValue, null, 2),
  validate: (value) => {
    if (!value) {
      return true
    }

    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  },
  deserialize: (data) => {
    const fieldValue = data[config.fieldKey]

    if (fieldValue === null) {
      return ''
    }

    return JSON.stringify(fieldValue, null, 2)
  },
  serialize: (fieldValue) => {
    if (!fieldValue) {
      return { [config.fieldKey]: null }
    }

    try {
      return { [config.fieldKey]: JSON.parse(fieldValue) }
    } catch {
      return { [config.fieldKey]: undefined }
    }
  },
})
