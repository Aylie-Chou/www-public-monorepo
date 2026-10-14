import React, { useState, useCallback, memo, type ChangeEvent } from 'react'
// dnd
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
// emotion
import styled from '@emotion/styled'
// keystone
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

import { SortableItem } from '../../DragAndDrop/SortableItem'

type FooterLink = {
  text: string
  link: string
  id?: string
}

type FooterLinksColumn = FooterLink[]

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
`

const ColumnContainer = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`

const ColumnTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #333;
`

const ItemContainer = styled.div`
  flex: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 15px;
`

const DragHandle = styled.div`
  cursor: grab;
  padding: 0 8px;
  display: flex;
  align-items: center;
  color: #666;
  user-select: none;
  &:active {
    cursor: grabbing;
  }
  &::before {
    content: '⋮⋮';
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: -2px;
  }
`

const TextInput_Container = styled.div`
  flex: 1;
  min-width: 150px;
`

const LinkInput_Container = styled.div`
  flex: 1;
  min-width: 200px;
`

const GtmInput_Container = styled.div`
  width: 150px;
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
  padding: 10px;
`

const footerLinkTemplate: FooterLink = {
  text: '',
  link: '',
  id: '',
}

const NewLinkForm = memo(
  (props: {
    footerLink: FooterLink
    onTextChange: (e: ChangeEvent<HTMLInputElement>) => void
    onLinkChange: (e: ChangeEvent<HTMLInputElement>) => void
    onIdChange: (e: ChangeEvent<HTMLInputElement>) => void
    onAdd: () => void
    isDisabled: boolean
    isAddDisabled: boolean
  }) => {
    const {
      footerLink,
      onTextChange,
      onLinkChange,
      onIdChange,
      onAdd,
      isDisabled,
      isAddDisabled,
    } = props

    return (
      <ItemContainer>
        <TextInput_Container>
          <TextInput
            placeholder="文字（必填）"
            onChange={onTextChange}
            value={footerLink.text}
            disabled={isDisabled}
          />
        </TextInput_Container>
        <LinkInput_Container>
          <TextInput
            placeholder="連結網址（必填）"
            onChange={onLinkChange}
            value={footerLink.link}
            disabled={isDisabled}
          />
        </LinkInput_Container>
        <GtmInput_Container>
          <TextInput
            placeholder="GTM ID（選填）"
            onChange={onIdChange}
            value={footerLink.id || ''}
            disabled={isDisabled}
          />
        </GtmInput_Container>
        <IconButton size="small" onClick={onAdd} isDisabled={isAddDisabled}>
          <PlusCircleIcon size="small" color="green" />
        </IconButton>
      </ItemContainer>
    )
  }
)

const FooterLinkComponent = memo(
  (props: {
    footerLink: FooterLink
    index: number
    onTextChange: (index: number, text: string) => void
    onLinkChange: (index: number, link: string) => void
    onIdChange: (index: number, id: string) => void
    onDelete: (index: number) => void
    showDragHandle?: boolean
    isDisabled?: boolean
  }) => {
    const {
      footerLink,
      index,
      onTextChange,
      onLinkChange,
      onIdChange,
      onDelete,
      showDragHandle = false,
      isDisabled = false,
    } = props

    const handleTextChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onTextChange(index, e.target.value)
      },
      [index, onTextChange]
    )

    const handleLinkChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onLinkChange(index, e.target.value)
      },
      [index, onLinkChange]
    )

    const handleIdChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onIdChange(index, e.target.value)
      },
      [index, onIdChange]
    )

    const handleDelete = useCallback(() => {
      onDelete(index)
    }, [index, onDelete])

    return (
      <ItemContainer>
        {showDragHandle && <DragHandle />}
        <TextInput_Container>
          <TextInput
            placeholder="文字（必填）"
            onChange={handleTextChange}
            value={footerLink.text}
            disabled={isDisabled}
          />
        </TextInput_Container>
        <LinkInput_Container>
          <TextInput
            placeholder="連結網址（必填）"
            onChange={handleLinkChange}
            value={footerLink.link}
            disabled={isDisabled}
          />
        </LinkInput_Container>
        <GtmInput_Container>
          <TextInput
            placeholder="GTM ID（選填）"
            onChange={handleIdChange}
            value={footerLink.id || ''}
            disabled={isDisabled}
          />
        </GtmInput_Container>
        <IconButton size="small" onClick={handleDelete}>
          <TrashIcon size="small" />
        </IconButton>
      </ItemContainer>
    )
  }
)

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  /*
    display for links group
    | first column | second column | third column |
    | XXXX         | XXXX          | XXX          |
    | XXXXX        | XXXXXX        | XX           |
  */
  const parseFooterLinks = (
    val: string | null | undefined
  ): FooterLinksColumn[] => {
    if (!val) return [[], [], []]
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed) && parsed.length === 3) {
        return parsed.map((column) => (Array.isArray(column) ? column : []))
      }
      return [[], [], []]
    } catch {
      return [[], [], []]
    }
  }

  const [columns, setColumns] = useState<FooterLinksColumn[]>(
    parseFooterLinks(value)
  )
  const [newLinks, setNewLinks] = useState<FooterLink[]>([
    { ...footerLinkTemplate },
    { ...footerLinkTemplate },
    { ...footerLinkTemplate },
  ])
  const [prevValue, setPrevValue] = useState(value)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (value !== prevValue) {
    setPrevValue(value)
    setColumns(parseFooterLinks(value))
  }

  const onAddNewLink = useCallback(
    (columnIndex: number) => {
      if (
        onChange &&
        newLinks[columnIndex].text.trim() &&
        newLinks[columnIndex].link.trim()
      ) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          newColumns[columnIndex] = [
            ...newColumns[columnIndex],
            newLinks[columnIndex],
          ]
          onChange(JSON.stringify(newColumns))
          return newColumns
        })

        setNewLinks((prevNewLinks) => {
          const updatedNewLinks = [...prevNewLinks]
          updatedNewLinks[columnIndex] = { ...footerLinkTemplate }
          return updatedNewLinks
        })
      }
    },
    [newLinks, onChange]
  )

  const onDeleteLink = useCallback(
    (columnIndex: number, linkIndex: number) => {
      if (onChange) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          if (linkIndex >= 0 && linkIndex < newColumns[columnIndex].length) {
            newColumns[columnIndex] = [
              ...newColumns[columnIndex].slice(0, linkIndex),
              ...newColumns[columnIndex].slice(linkIndex + 1),
            ]
            onChange(JSON.stringify(newColumns))
          }
          return newColumns
        })
      }
    },
    [onChange]
  )

  const onUpdateLinkText = useCallback(
    (columnIndex: number, linkIndex: number, text: string) => {
      if (onChange) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          if (linkIndex >= 0 && linkIndex < newColumns[columnIndex].length) {
            newColumns[columnIndex] = [...newColumns[columnIndex]]
            newColumns[columnIndex][linkIndex] = {
              ...newColumns[columnIndex][linkIndex],
              text,
            }
            onChange(JSON.stringify(newColumns))
          }
          return newColumns
        })
      }
    },
    [onChange]
  )

  const onUpdateLinkUrl = useCallback(
    (columnIndex: number, linkIndex: number, link: string) => {
      if (onChange) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          if (linkIndex >= 0 && linkIndex < newColumns[columnIndex].length) {
            newColumns[columnIndex] = [...newColumns[columnIndex]]
            newColumns[columnIndex][linkIndex] = {
              ...newColumns[columnIndex][linkIndex],
              link,
            }
            onChange(JSON.stringify(newColumns))
          }
          return newColumns
        })
      }
    },
    [onChange]
  )

  const onUpdateLinkId = useCallback(
    (columnIndex: number, linkIndex: number, id: string) => {
      if (onChange) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          if (linkIndex >= 0 && linkIndex < newColumns[columnIndex].length) {
            newColumns[columnIndex] = [...newColumns[columnIndex]]
            newColumns[columnIndex][linkIndex] = {
              ...newColumns[columnIndex][linkIndex],
              id,
            }
            onChange(JSON.stringify(newColumns))
          }
          return newColumns
        })
      }
    },
    [onChange]
  )

  const onUpdateNewLinkText = useCallback(
    (columnIndex: number, e: ChangeEvent<HTMLInputElement>) => {
      setNewLinks((prevNewLinks) => {
        const updatedNewLinks = [...prevNewLinks]
        updatedNewLinks[columnIndex] = {
          ...updatedNewLinks[columnIndex],
          text: e.target.value,
        }
        return updatedNewLinks
      })
    },
    []
  )

  const onUpdateNewLinkUrl = useCallback(
    (columnIndex: number, e: ChangeEvent<HTMLInputElement>) => {
      setNewLinks((prevNewLinks) => {
        const updatedNewLinks = [...prevNewLinks]
        updatedNewLinks[columnIndex] = {
          ...updatedNewLinks[columnIndex],
          link: e.target.value,
        }
        return updatedNewLinks
      })
    },
    []
  )

  const onUpdateNewLinkId = useCallback(
    (columnIndex: number, e: ChangeEvent<HTMLInputElement>) => {
      setNewLinks((prevNewLinks) => {
        const updatedNewLinks = [...prevNewLinks]
        updatedNewLinks[columnIndex] = {
          ...updatedNewLinks[columnIndex],
          id: e.target.value,
        }
        return updatedNewLinks
      })
    },
    []
  )

  const handleDragEnd = useCallback(
    (columnIndex: number) => (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = parseInt(active.id.toString())
        const newIndex = parseInt(over.id.toString())

        setColumns((prevColumns) => {
          const newColumns = [...prevColumns]
          newColumns[columnIndex] = arrayMove(
            newColumns[columnIndex],
            oldIndex,
            newIndex
          )
          onChange?.(JSON.stringify(newColumns))
          return newColumns
        })
      }
    },
    [onChange]
  )

  const renderColumn = (columnIndex: number, columnTitle: string) => {
    const columnLinks = columns[columnIndex]
    const newLink = newLinks[columnIndex]
    const isAddDisabled = !newLink.text.trim() || !newLink.link.trim()

    return (
      <ColumnContainer key={columnIndex}>
        <ColumnTitle>{columnTitle}</ColumnTitle>
        <Container>
          {columnLinks.length === 0 ? (
            <EmptyState>請新增連結...</EmptyState>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd(columnIndex)}
            >
              <SortableContext
                items={columnLinks.map((_, index) => index)}
                strategy={verticalListSortingStrategy}
              >
                {columnLinks.map((link, linkIndex) => (
                  <SortableItem
                    key={`${link.text}-${linkIndex}`}
                    id={linkIndex}
                  >
                    <FooterLinkComponent
                      showDragHandle={true}
                      footerLink={link}
                      index={linkIndex}
                      onTextChange={(idx, text) =>
                        onUpdateLinkText(columnIndex, idx, text)
                      }
                      onLinkChange={(idx, url) =>
                        onUpdateLinkUrl(columnIndex, idx, url)
                      }
                      onIdChange={(idx, id) =>
                        onUpdateLinkId(columnIndex, idx, id)
                      }
                      onDelete={(idx) => onDeleteLink(columnIndex, idx)}
                      isDisabled={true}
                    />
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </Container>
        <GapDivider />
        {onChange && (
          <NewLinkForm
            footerLink={newLink}
            onTextChange={(e) => onUpdateNewLinkText(columnIndex, e)}
            onLinkChange={(e) => onUpdateNewLinkUrl(columnIndex, e)}
            onIdChange={(e) => onUpdateNewLinkId(columnIndex, e)}
            onAdd={() => onAddNewLink(columnIndex)}
            isDisabled={false}
            isAddDisabled={isAddDisabled}
          />
        )}
      </ColumnContainer>
    )
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {renderColumn(0, '第一欄')}
      {renderColumn(1, '第二欄')}
      {renderColumn(2, '第三欄')}
    </FieldContainer>
  )
}
