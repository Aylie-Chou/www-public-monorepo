import styled from '@emotion/styled'
import React from 'react'
// type
import type {
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
// components
import { CellContainer } from '@keystone-6/core/admin-ui/components'
import {
  FieldContainer,
  FieldDescription,
  FieldLabel,
} from '../../../admin/components/controls'

const Container = styled.div`
  display: flex;
  gap: 16px;
`

type RelationshipLinkValue = {
  summary?: string
  link: {
    url: string
    desc: string
  }
} | null

export const Field = ({
  field,
  value,
}: FieldProps<typeof controller> & { value: RelationshipLinkValue }) => {
  if (!value) {
    return (
      <FieldContainer>
        <FieldLabel htmlFor={field.fieldKey}>{field.label}</FieldLabel>
        <div>目前沒有資料</div>
      </FieldContainer>
    )
  }
  const { summary, link } = value
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.fieldKey}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.fieldKey}-description`}>
        {field.description}
      </FieldDescription>
      <Container>
        {summary ? <div>{summary}</div> : null}
        <a href={link.url} target="_self">
          {link.desc}
        </a>
      </Container>
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ value }) => (
  <CellContainer>{value == null ? '' : String(value)}</CellContainer>
)

export const controller = (
  config: FieldControllerConfig
): FieldController<RelationshipLinkValue> => {
  return {
    fieldKey: config.fieldKey,
    label: config.label,
    description: config.description,
    graphqlSelection: config.fieldKey,
    defaultValue: null,
    deserialize: (data) => data[config.fieldKey] ?? null,
    serialize: () => {},
  }
}
