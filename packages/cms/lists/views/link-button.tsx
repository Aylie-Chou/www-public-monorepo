import type { controller } from '@keystone-6/core/fields/types/virtual/views'
import type { FieldProps } from '@keystone-6/core/types'
import { Button } from '../../admin/components/controls'
import { FieldContainer, FieldLabel } from '../../admin/components/controls'
import React from 'react'

export const Field = ({ value }: FieldProps<typeof controller>) => {
  if (typeof value === 'object' && value !== null) {
    const link = value as {
      href: string
      target?: string
      label: string
      buttonLabel: string
    }
    const href = link.href
    const target = link.target || '_blank'
    const label = link.label
    const buttonLabel = link.buttonLabel

    return (
      <FieldContainer>
        <FieldLabel>{label}</FieldLabel>
        <a href={href} target={target} style={{ textDecoration: 'none' }}>
          <Button>{buttonLabel}</Button>
        </a>
      </FieldContainer>
    )
  } else {
    return null
  }
}
