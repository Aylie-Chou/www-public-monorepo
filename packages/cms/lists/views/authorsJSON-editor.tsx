import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import styled from '@emotion/styled'
import type { controller } from '@keystone-6/core/fields/types/json/views'
import type { FieldProps } from '@keystone-6/core/types'
import { Button } from '../../admin/components/controls'
import { Divider } from '../../admin/components/controls'
import {
  FieldContainer,
  FieldLabel,
  TextInput,
} from '../../admin/components/controls'
import { PlusCircleIcon, TrashIcon } from '../../admin/components/controls'
import type React from 'react'
import { useState } from 'react'

import { SortableItem } from '../../DragAndDrop/SortableItem'

type Author = {
  id: string | undefined
  name: string
  role: string
  type: string
}

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
`

const AuthorContainer = styled.div`
  flex: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 15px;
`

const ID = styled.span`
  width: 40px;
`

const Name = styled.div`
  width: 25%;
`

const Role = styled.div`
  width: 25%;
`

const IconButton = styled(Button)`
  background-color: transparent;
  margin: 0 0 0 0.5rem;
`

const GapDivider = styled(Divider)`
  margin-top: 10px;
  margin-bottom: 15px;
`

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  color: #6b7280;
`

// Add a non-draggable wrapper to prevent event bubbling
const NonDraggableArea = styled.div`
  pointer-events: auto;
`

const authorTemplate = {
  id: undefined,
  name: '',
  role: '文字',
  type: 'string',
}

const AuthorComponent = (props: {
  author: Author
  isNameEditable?: boolean
  onNameChange: React.ChangeEventHandler<HTMLInputElement>
  onRoleChange: React.ChangeEventHandler<HTMLInputElement>
  actionElement: React.ReactNode
}) => {
  const author = props?.author
  return (
    (author && (
      <AuthorContainer>
        <ID>{author.id ?? 'N/A'}</ID>
        <Name>
          <NonDraggableArea>
            {props.isNameEditable ? (
              <TextInput
                placeholder="姓名"
                onChange={props.onNameChange}
                value={author.name}
              />
            ) : (
              author.name
            )}
          </NonDraggableArea>
        </Name>
        <Role>
          <NonDraggableArea>
            <TextInput
              placeholder="角色"
              onChange={props.onRoleChange}
              value={author.role}
            />
          </NonDraggableArea>
        </Role>
        <span>{author.type}</span>
        <NonDraggableArea>{props.actionElement}</NonDraggableArea>
      </AuthorContainer>
    )) ||
    null
  )
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const [authors, setAuthors] = useState<Author[]>(
    value ? JSON.parse(value) : []
  )
  const [newAuthor, setNewAuthor] = useState<Author>({ ...authorTemplate })
  const [prevValue, setPrevValue] = useState(value)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (value !== prevValue) {
    setPrevValue(value)
    setAuthors(value ? JSON.parse(value) : [])
  }

  const onAddNewAuthor = () => {
    if (onChange) {
      const newAuthors = [...authors, newAuthor]
      setAuthors(newAuthors)
      onChange(JSON.stringify(newAuthors))
      setNewAuthor({ ...authorTemplate })
    }
  }

  const onDeleteAuthor = (index: number) => {
    if (onChange && index >= 0 && index < authors.length) {
      const newAuthors = [...authors]
      newAuthors.splice(index, 1)
      setAuthors(newAuthors)
      onChange(JSON.stringify(newAuthors))
    }
  }

  const onUpdateAuthorName = (index: number, name: string) => {
    if (onChange && index >= 0 && index < authors.length) {
      const before = authors.slice(0, index)
      const modifiedAuthor = {
        ...authors[index],
      }
      modifiedAuthor.name = name
      const after = authors.slice(index + 1)
      const newAuthors = [...before, modifiedAuthor, ...after]
      setAuthors(newAuthors)
      onChange(JSON.stringify(newAuthors))
    }
  }

  const onUpdateAuthorRole = (index: number, role: string) => {
    if (onChange && index >= 0 && index < authors.length) {
      const before = authors.slice(0, index)
      const modifiedAuthor = {
        ...authors[index],
      }
      modifiedAuthor.role = role
      const after = authors.slice(index + 1)
      const newAuthors = [...before, modifiedAuthor, ...after]
      setAuthors(newAuthors)
      onChange(JSON.stringify(newAuthors))
    }
  }

  const onUpdateNewAuthorName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor({
      ...newAuthor,
      name: e.target.value,
    })
  }

  const onUpdateNewAuthorRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthor({
      ...newAuthor,
      role: e.target.value,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newAuthors = arrayMove(authors, oldIndex, newIndex)
      setAuthors(newAuthors)
      onChange?.(JSON.stringify(newAuthors))
    }
  }

  const renderAuthors = () => {
    if (authors.length === 0) {
      return <EmptyState>請選擇作者...</EmptyState>
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={authors.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {authors.map((author, index) => (
            <SortableItem key={index} id={index}>
              <AuthorComponent
                author={author}
                isNameEditable={!author?.id}
                onNameChange={(e) => onUpdateAuthorName(index, e.target.value)}
                onRoleChange={(e) => onUpdateAuthorRole(index, e.target.value)}
                actionElement={
                  <IconButton
                    size="small"
                    onClick={() => !author.id && onDeleteAuthor(index)}
                    isDisabled={!!author.id}
                  >
                    <TrashIcon size="small" />
                  </IconButton>
                }
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <Container>{renderAuthors()}</Container>
      <GapDivider />
      {(onChange && (
        <AuthorComponent
          author={newAuthor}
          isNameEditable={true}
          onNameChange={onUpdateNewAuthorName}
          onRoleChange={onUpdateNewAuthorRole}
          actionElement={
            <IconButton size="small" onClick={onAddNewAuthor}>
              <PlusCircleIcon size="small" color="green" />
            </IconButton>
          }
        />
      )) ||
        null}
    </FieldContainer>
  )
}
