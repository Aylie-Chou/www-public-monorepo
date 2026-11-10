import { type FC, type KeyboardEvent, type MouseEvent, useState } from 'react'

import {
  PluginButton,
  PluginDialog,
  PluginField,
  PluginTextInput,
  PluginTextarea,
  PluginToggle,
} from '../../../components/PluginUI'
import type { EmbeddedCodeLayout } from '../types'
import EmbeddedCodeLayoutOptions from './EmbeddedCodeLayoutOptions'
import { confirmEmbeddedCodeTrust } from '../utils/embeddedCodeTrust'

type EmbeddedCodeEditDialogProps = {
  embeddedCode: string
  caption?: string
  layout: EmbeddedCodeLayout
  showLoading?: boolean
  onConfirm: (
    embeddedCode: string,
    layout: EmbeddedCodeLayout,
    caption: string,
    showLoading: boolean
  ) => void
  onClose: () => void
  onDelete?: () => void
}

const EmbeddedCodeEditDialog: FC<EmbeddedCodeEditDialogProps> = ({
  embeddedCode,
  caption = '',
  layout,
  showLoading = false,
  onConfirm,
  onClose,
  onDelete,
}) => {
  const [currentEmbeddedCode, setCurrentEmbeddedCode] = useState(embeddedCode)
  const [currentCaption, setCurrentCaption] = useState(caption)
  const [currentLayout, setCurrentLayout] = useState(layout)
  const [currentShowLoading, setCurrentShowLoading] = useState(showLoading)

  const cancel = () => {
    onClose()
  }

  const confirm = () => {
    const trimmedEmbeddedCode = currentEmbeddedCode.trim()

    if (!trimmedEmbeddedCode) {
      alert('此編輯欄位不可空白，請輸入內容。')
      return
    }

    if (!confirmEmbeddedCodeTrust(trimmedEmbeddedCode)) {
      return
    }

    onConfirm(
      trimmedEmbeddedCode,
      currentLayout,
      currentCaption,
      currentShowLoading
    )
    onClose()
  }

  const deleteNode = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (typeof onDelete === 'function') {
      onDelete()
    }
  }

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      e.stopPropagation()
    }
  }

  return (
    <PluginDialog
      title="編輯 Embedded Code"
      className="EmbeddedCode__edit_dialog"
      actions={
        <>
          {onDelete && (
            <PluginButton variant="danger" onClick={deleteNode}>
              Delete
            </PluginButton>
          )}
          <PluginButton onClick={cancel}>Cancel</PluginButton>
          <PluginButton variant="primary" onClick={confirm}>
            Confirm
          </PluginButton>
        </>
      }
    >
      <PluginField label="Embedded Code">
        <PluginTextarea
          value={currentEmbeddedCode}
          onChange={(e) => setCurrentEmbeddedCode(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </PluginField>
      <PluginField label="Caption">
        <PluginTextInput
          type="text"
          value={currentCaption}
          onChange={(e) => setCurrentCaption(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </PluginField>
      <PluginField label="Layout">
        <EmbeddedCodeLayoutOptions
          layout={currentLayout}
          onChange={setCurrentLayout}
        />
      </PluginField>
      <PluginField label="Show Loading Skeleton">
        <PluginToggle
          checked={currentShowLoading}
          label=""
          onChange={setCurrentShowLoading}
        />
      </PluginField>
    </PluginDialog>
  )
}

export default EmbeddedCodeEditDialog
