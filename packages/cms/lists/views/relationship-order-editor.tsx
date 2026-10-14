import type { controller } from '@keystone-6/core/fields/types/json/views'
import type { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '../../admin/components/controls'
import { useMemo, type Dispatch, type SetStateAction } from 'react'
import { DnD } from '../../DragAndDrop'

export type RelationshipInfo = {
  id: string
  label: string
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const relationships = useMemo<RelationshipInfo[]>(
    () => (value ? JSON.parse(value) : []),
    [value]
  )

  const setRelationships: Dispatch<SetStateAction<RelationshipInfo[]>> = (
    update
  ) => {
    if (!onChange) return
    const next = typeof update === 'function' ? update(relationships) : update
    if (JSON.stringify(next) !== JSON.stringify(relationships)) {
      onChange(JSON.stringify(next))
    }
  }

  const relationshipsDndComponent = (
    <DnD items={relationships} setItems={setRelationships} />
  )

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {relationshipsDndComponent}
    </FieldContainer>
  )
}
