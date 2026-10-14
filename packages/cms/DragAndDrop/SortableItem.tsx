import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styled from '@emotion/styled'
import type { ReactNode } from 'react'

type Props = {
  id: string | number
  children: ReactNode
}

export const SortableItem = (props: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })

  const Item = styled.div`
    transform: ${CSS.Transform.toString(transform)};
    transition: ${transition};
    padding: 5px;
    margin: 0px 0px 5px;
    border: 1px solid lightgrey;
    border-radius: 5px;
    :hover {
      cursor: move;
    }
  `

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <Item>{props.children}</Item>
    </div>
  )
}
