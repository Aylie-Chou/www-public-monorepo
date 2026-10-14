import styled from '@emotion/styled'
import { CellContainer } from '@keystone-6/core/admin-ui/components'
import type {
  CellComponent,
  FieldController,
  FieldControllerConfig,
  FieldProps,
} from '@keystone-6/core/types'
import {
  FieldContainer,
  FieldDescription,
  FieldLabel,
} from '../../../admin/components/controls'
import React from 'react'

const Container = styled.div`
  display: flex;
`
const Margin = styled.div<{ $width: string }>`
  width: ${(props) => props.$width};
`
const Option = styled.div<{ $selected: boolean }>`
  width: 180px;
  height: 180px;
  border-radius: 5px;
  background: ${(props) => (props.$selected ? '#E1E5E9' : '#EFF3F6')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  margin-left: 40px;
  &:first-child {
    margin-left: 0;
  }
`
const SkeletonBox = styled.div`
  display: flex;
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
`

const SkeletonRow = ({ active = false }: { active: boolean }) => {
  const strokeColor = active ? '#6B7280' : '#E1E5E9'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="60"
      viewBox="0 0 45 60"
      fill="none"
    >
      <path d="M0.5 0.5H44.5V59.5H0.5V0.5Z" fill="white" stroke={strokeColor} />
      <rect x="4" y="4" width="37" height="23" fill="#EFF3F6" />
      <rect x="4" y="30" width="37" height="4" fill="#EFF3F6" />
      <rect x="4" y="36" width="22" height="4" fill="#EFF3F6" />
      <rect x="4" y="42" width="37" height="2" fill="#EFF3F6" />
      <rect x="4" y="46" width="37" height="2" fill="#EFF3F6" />
      <rect x="4" y="50" width="37" height="2" fill="#EFF3F6" />
      <rect x="4" y="54" width="22" height="2" fill="#EFF3F6" />
    </svg>
  )
}

const SkeletonColumn = ({ active = false }: { active: boolean }) => {
  const strokeColor = active ? '#6B7280' : '#E1E5E9'
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="119"
        height="39"
        fill="white"
        stroke={strokeColor}
      />
      <rect x="4" y="4" width="50" height="32" fill="#EFF3F6" />
      <rect x="57" y="4" width="58" height="4" fill="#EFF3F6" />
      <rect x="57" y="10" width="34.4865" height="4" fill="#EFF3F6" />
      <rect x="57" y="16" width="58" height="2" fill="#EFF3F6" />
      <rect x="57" y="20" width="58" height="2" fill="#EFF3F6" />
      <rect x="57" y="24" width="58" height="2" fill="#EFF3F6" />
      <rect x="57" y="28" width="34.4865" height="2" fill="#EFF3F6" />
    </svg>
  )
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const isSelectRow = !value || value === 'row'
  const select = (value: 'row' | 'column') => onChange?.(value)

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.fieldKey}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.fieldKey}-description`}>
        {field.description}
      </FieldDescription>
      <Container>
        <Option $selected={isSelectRow} onClick={() => select('row')}>
          <SkeletonBox>
            <SkeletonRow active={isSelectRow} />
            <Margin $width="5px" />
            <SkeletonRow active={isSelectRow} />
            <Margin $width="5px" />
            <SkeletonRow active={isSelectRow} />
          </SkeletonBox>
          <SkeletonBox>
            <SkeletonRow active={isSelectRow} />
            <Margin $width="5px" />
            <SkeletonRow active={isSelectRow} />
          </SkeletonBox>
        </Option>
        <Option $selected={!isSelectRow} onClick={() => select('column')}>
          <SkeletonBox>
            <SkeletonColumn active={!isSelectRow} />
          </SkeletonBox>
          <SkeletonBox>
            <SkeletonColumn active={!isSelectRow} />
          </SkeletonBox>
          <SkeletonBox>
            <SkeletonColumn active={!isSelectRow} />
          </SkeletonBox>
        </Option>
      </Container>
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ value }) => (
  <CellContainer>{value == null ? '' : String(value)}</CellContainer>
)

export const controller = (
  config: FieldControllerConfig<any>
): FieldController<string | null, string> => {
  return {
    fieldKey: config.fieldKey,
    label: config.label,
    description: config.description,
    graphqlSelection: config.fieldKey,
    defaultValue: null,
    deserialize: (data) => {
      const value = data[config.fieldKey]
      return typeof value === 'string' ? value : null
    },
    serialize: (value) => ({ [config.fieldKey]: value }),
  }
}
