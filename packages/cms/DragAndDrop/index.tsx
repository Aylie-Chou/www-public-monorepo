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
import type { ReactNode, SetStateAction } from 'react'

import { SortableItem } from './SortableItem'

type DnDItem = {
  id: string | number
  label: string
  itemJSX?: ReactNode
}

// Styled Components
const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
`

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  color: #6b7280;
`

// Define a more specific type for setItems
type DnDProps<T extends DnDItem> = {
  items: T[]
  setItems: React.Dispatch<SetStateAction<T[]>>
  emptyPlachholder?: string
}

export const DnD = <T extends DnDItem>({
  items,
  setItems,
  emptyPlachholder = '請選擇...',
}: DnDProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((i) => i.id === active.id)
        const newIndex = currentItems.findIndex((i) => i.id === over.id)
        return arrayMove(currentItems, oldIndex, newIndex)
      })
    }
  }

  if (items.length === 0) {
    return (
      <Container>
        <EmptyState>{emptyPlachholder}</EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {item.itemJSX ? (
                item.itemJSX
              ) : (
                <span>
                  {index + 1}. {item.label}
                </span>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Container>
  )
}
