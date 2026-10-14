import styled from '@emotion/styled'
import { Button as KeystarButton } from '@keystar/ui/button'
import { Combobox, ComboboxMulti, Item } from '@keystar/ui/combobox'
import {
  AlertDialog as KeystarAlertDialog,
  DialogContainer,
} from '@keystar/ui/dialog'
import { Icon } from '@keystar/ui/icon'
import { plusCircleIcon } from '@keystar/ui/icon/icons/plusCircleIcon'
import { trashIcon } from '@keystar/ui/icon/icons/trashIcon'
import { Divider as KeystarDivider } from '@keystar/ui/layout'
import { toastQueue } from '@keystar/ui/toast'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

export { FieldDescription, FieldLabel } from '@keystar/ui/field'
export function Divider({
  className,
  UNSAFE_className,
  ...props
}: ComponentProps<typeof KeystarDivider> & { className?: string }) {
  return (
    <KeystarDivider
      {...props}
      UNSAFE_className={
        [UNSAFE_className, className].filter(Boolean).join(' ') || undefined
      }
    />
  )
}
export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
export const TextInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #b6bcc2;
  border-radius: 6px;
  font: inherit;
  &:disabled { opacity: 0.6; }
`

// Keep the custom editors' existing event handlers while using Keystar controls.
export function Button({
  weight,
  tone,
  size,
  isLoading,
  onClick,
  className,
  ...props
}: PropsWithChildren<{
  weight?: 'bold' | 'none' | 'light' | 'link'
  tone?: 'active' | 'negative' | 'passive'
  size?: string
  isLoading?: boolean
  isDisabled?: boolean
  onClick?: () => void
  className?: string
}>) {
  return (
    <KeystarButton
      {...props}
      UNSAFE_className={className}
      prominence={
        weight === 'bold' ? 'high' : weight === 'none' ? 'low' : 'default'
      }
      tone={
        tone === 'negative'
          ? 'critical'
          : tone === 'active'
            ? 'accent'
            : 'neutral'
      }
      isPending={isLoading}
      onPress={onClick}
    />
  )
}

type Option = { value: string; label: string }
export function Select<T extends Option>({
  value,
  options,
  onChange,
  placeholder,
  isDisabled,
}: {
  value: T | null
  options: T[]
  onChange: (option: T | null) => void
  placeholder?: string
  isDisabled?: boolean
}) {
  return (
    <Combobox
      aria-label={placeholder || 'Select'}
      placeholder={placeholder}
      items={options}
      selectedKey={value?.value ?? null}
      onSelectionChange={(key) =>
        onChange(options.find((option) => option.value === key) ?? null)
      }
      isDisabled={isDisabled}
    >
      {(option) => <Item key={option.value}>{option.label}</Item>}
    </Combobox>
  )
}
export function MultiSelect<T extends Option>({
  value,
  options,
  onChange,
}: {
  value: T[]
  options: T[]
  onChange: (options: T[]) => void
}) {
  return (
    <ComboboxMulti
      aria-label="選取項目"
      items={options}
      selectedKeys={value.map((option) => option.value)}
      onSelectionChange={(keys) => {
        if (keys === 'all') return onChange(options)
        const retained = value.filter((option) => keys.has(option.value))
        const added = options.filter(
          (option) =>
            keys.has(option.value) &&
            !value.some((selected) => selected.value === option.value)
        )
        onChange([...retained, ...added])
      }}
    >
      {(option) => <Item key={option.value}>{option.label}</Item>}
    </ComboboxMulti>
  )
}
export function Heading({ children }: PropsWithChildren<{ type?: string }>) {
  return <h3>{children}</h3>
}
export function PlusCircleIcon(_props: { size?: string; color?: string }) {
  return <Icon src={plusCircleIcon} />
}
export function TrashIcon(_props: { size?: string }) {
  return <Icon src={trashIcon} />
}
export function AlertDialog({
  isOpen,
  actions,
  title,
  children,
}: {
  isOpen: boolean
  title: string
  tone?: string
  children: ReactNode
  actions: {
    confirm: { action: () => void; label: string }
    cancel: { action: () => void; label: string }
  }
}) {
  return (
    <DialogContainer onDismiss={actions.cancel.action}>
      {isOpen ? (
        <KeystarAlertDialog
          title={title}
          tone="critical"
          primaryActionLabel={actions.confirm.label}
          cancelLabel={actions.cancel.label}
          onPrimaryAction={actions.confirm.action}
          onCancel={actions.cancel.action}
        >
          {children}
        </KeystarAlertDialog>
      ) : null}
    </DialogContainer>
  )
}
export function useToasts() {
  return {
    addToast({
      title,
      tone,
      message,
    }: {
      title: string
      tone: string
      message?: string
    }) {
      const content = message ? `${title}: ${message}` : title
      return tone === 'negative'
        ? toastQueue.critical(content)
        : toastQueue.positive(content)
    },
  }
}
