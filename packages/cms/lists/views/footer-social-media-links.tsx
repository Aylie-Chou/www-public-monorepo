import React, { useState, type ChangeEvent, type ReactNode } from 'react'
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
  Select,
} from '../../admin/components/controls'
import { PlusCircleIcon, TrashIcon } from '../../admin/components/controls'

import { SortableItem } from '../../DragAndDrop/SortableItem'

type SocialMediaLink = {
  icon: string
  link: string
}

const SOCIAL_MEDIA_OPTIONS = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Threads', value: 'threads' },
  { label: 'Medium', value: 'medium' },
  { label: 'Line', value: 'line' },
  { label: 'Google', value: 'google' },
  { label: 'Plurk', value: 'plurk' },
]

const Container = styled.div`
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 10px;
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

const IconSelect = styled.div`
  width: 30%;
`

const LinkInput = styled.div`
  flex: 1;
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

const socialMediaLinkTemplate: SocialMediaLink = {
  icon: '',
  link: '',
}

const SocialMediaLinkComponent = (props: {
  socialMediaLink: SocialMediaLink
  onIconChange: (value: string) => void
  onLinkChange: (e: ChangeEvent<HTMLInputElement>) => void
  actionElement: ReactNode
  isDisabled?: boolean
  showDragHandle?: boolean
}) => {
  const { socialMediaLink, isDisabled = false, showDragHandle = false } = props
  return (
    <ItemContainer>
      {showDragHandle && <DragHandle />}
      <IconSelect>
        <Select
          placeholder="請選擇 icon（必填）"
          value={
            socialMediaLink.icon
              ? SOCIAL_MEDIA_OPTIONS.find(
                  (opt) => opt.value === socialMediaLink.icon
                ) || null
              : null
          }
          onChange={(option) => {
            if (option) {
              props.onIconChange(option.value)
            }
          }}
          options={SOCIAL_MEDIA_OPTIONS}
          isDisabled={isDisabled}
        />
      </IconSelect>
      <LinkInput>
        <TextInput
          placeholder="連結網址（必填）"
          onChange={props.onLinkChange}
          value={socialMediaLink.link}
          disabled={isDisabled}
        />
      </LinkInput>
      {props.actionElement}
    </ItemContainer>
  )
}

export const Field = ({
  field,
  value,
  onChange,
}: FieldProps<typeof controller>) => {
  const parseSocialMediaLinks = (
    val: string | null | undefined
  ): SocialMediaLink[] => {
    if (!val) return []
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
    parseSocialMediaLinks(value)
  )
  const [newLink, setNewLink] = useState<SocialMediaLink>({
    ...socialMediaLinkTemplate,
  })
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
    setSocialMediaLinks(parseSocialMediaLinks(value))
  }

  const onAddNewLink = () => {
    if (onChange && newLink.link.trim() && newLink.icon.trim()) {
      const newLinks = [...socialMediaLinks, newLink]
      setSocialMediaLinks(newLinks)
      onChange(JSON.stringify(newLinks))
      setNewLink({ ...socialMediaLinkTemplate })
    }
  }

  const onDeleteLink = (index: number) => {
    if (onChange && index >= 0 && index < socialMediaLinks.length) {
      const newLinks = [...socialMediaLinks]
      newLinks.splice(index, 1)
      setSocialMediaLinks(newLinks)
      onChange(JSON.stringify(newLinks))
    }
  }

  const onUpdateLinkIcon = (index: number, icon: string) => {
    if (
      onChange &&
      index >= 0 &&
      index < socialMediaLinks.length &&
      icon.trim()
    ) {
      const newLinks = [...socialMediaLinks]
      newLinks[index] = {
        ...newLinks[index],
        icon,
      }
      setSocialMediaLinks(newLinks)
      onChange(JSON.stringify(newLinks))
    }
  }

  const onUpdateLinkUrl = (index: number, link: string) => {
    if (
      onChange &&
      index >= 0 &&
      index < socialMediaLinks.length &&
      link.trim()
    ) {
      const newLinks = [...socialMediaLinks]
      newLinks[index] = {
        ...newLinks[index],
        link,
      }
      setSocialMediaLinks(newLinks)
      onChange(JSON.stringify(newLinks))
    }
  }

  const onUpdateNewLinkIcon = (icon: string) => {
    setNewLink({
      ...newLink,
      icon,
    })
  }

  const onUpdateNewLinkUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink({
      ...newLink,
      link: e.target.value,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      const newLinks = arrayMove(socialMediaLinks, oldIndex, newIndex)
      setSocialMediaLinks(newLinks)
      onChange?.(JSON.stringify(newLinks))
    }
  }

  const renderSocialMediaLinks = () => {
    if (socialMediaLinks.length === 0) {
      return <EmptyState>請新增社群媒體連結...</EmptyState>
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={socialMediaLinks.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          {socialMediaLinks.map((link, index) => (
            <SortableItem key={`${link.icon}-${index}`} id={index}>
              <SocialMediaLinkComponent
                isDisabled={true}
                showDragHandle={true}
                socialMediaLink={link}
                onIconChange={(icon) => onUpdateLinkIcon(index, icon)}
                onLinkChange={(e) => onUpdateLinkUrl(index, e.target.value)}
                actionElement={
                  <IconButton size="small" onClick={() => onDeleteLink(index)}>
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

  const isMaxLinksReached = socialMediaLinks.length >= 6
  const isAddButtonDisabled = isMaxLinksReached || !newLink.link.trim()

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <Container>{renderSocialMediaLinks()}</Container>
      <GapDivider />
      {onChange && (
        <SocialMediaLinkComponent
          socialMediaLink={newLink}
          onIconChange={onUpdateNewLinkIcon}
          onLinkChange={onUpdateNewLinkUrl}
          isDisabled={isMaxLinksReached}
          actionElement={
            <IconButton
              size="small"
              onClick={onAddNewLink}
              isDisabled={isAddButtonDisabled}
            >
              <PlusCircleIcon size="small" color="green" />
            </IconButton>
          }
        />
      )}
    </FieldContainer>
  )
}
