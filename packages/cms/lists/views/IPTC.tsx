import styled from '@emotion/styled'
import { FieldContainer, FieldLabel } from '../../admin/components/controls'
import React from 'react'

const Table = styled.div`
  width: 100%;
  background: rgb(248, 248, 248);
  padding: 10px 10px;
  border-radius: 6px;
`

const TableRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 5px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: 0px;
  }
`

const TableHeader = styled.div`
  width: 6em;
  padding: 5px 0;
  font-weight: 500;
  color: rgb(130, 140, 150);
`

const TableValue = styled.div`
  width: 100%;
  padding: 5px 0;
  font-weight: 500;
  color: rgb(140, 150, 160);
`

export const Field = ({
  field,
  value,
}: {
  field: { fieldKey: string; label: string }
  value: string
}) => {
  const valueObj = value ? JSON.parse(value) : {}
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.fieldKey}>{field.label}</FieldLabel>
      <Table>
        <TableRow>
          <TableHeader>作者</TableHeader>
          <TableValue>{valueObj?.author || ''}</TableValue>
        </TableRow>
        <TableRow>
          <TableHeader>描述</TableHeader>
          <TableValue>{valueObj?.description || ''}</TableValue>
        </TableRow>
        <TableRow>
          <TableHeader>關鍵字</TableHeader>
          <TableValue>{valueObj?.keywords || ''}</TableValue>
        </TableRow>
        <TableRow>
          <TableHeader>建立日期</TableHeader>
          <TableValue>{valueObj?.dateCreated || ''}</TableValue>
        </TableRow>
      </Table>
    </FieldContainer>
  )
}
