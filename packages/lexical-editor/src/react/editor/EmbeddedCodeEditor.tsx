import { useId, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import {
  $createEmbeddedCodeNode,
  $isEmbeddedCodeNode,
} from '../plugins/EmbeddedCodePlugin/nodes/EmbeddedCodeNode'
import { confirmEmbeddedCodeTrust } from '../plugins/EmbeddedCodePlugin/utils/embeddedCodeTrust'
import EmbeddedCodeDisplayMode from '../plugins/EmbeddedCodePlugin/components/EmbeddedCodeDisplayMode'

export default function EmbeddedCodeEditor({
  readOnly,
  onChange,
}: {
  readOnly?: boolean | undefined
  onChange?: ((value: string) => void) | undefined
}) {
  const [editor] = useLexicalComposerContext()
  const inputId = useId()
  const [code, setCode] = useState(() =>
    editor.getEditorState().read(() => {
      const node = $getRoot().getFirstChild()
      return $isEmbeddedCodeNode(node) ? node.exportJSON().embeddedCode : ''
    })
  )
  const [acceptedCode, setAcceptedCode] = useState(code)
  const [preview, setPreview] = useState(false)

  const acceptCode = (value: string) => {
    if (!confirmEmbeddedCodeTrust(value)) {
      return
    }
    setCode(value)
    setAcceptedCode(value)
    setPreview(false)
    editor.update(
      () => {
        const root = $getRoot()
        root.clear()
        if (value.trim()) {
          root.append($createEmbeddedCodeNode(value, 'default'))
        }
      },
      { discrete: true }
    )
    onChange?.(
      value.trim() ? JSON.stringify(editor.getEditorState().toJSON()) : ''
    )
  }

  return (
    <div className="embedded-code-editor">
      {!readOnly && (
        <div className="embedded-code-editor__controls">
          <label htmlFor={inputId}>Add Embedded Code</label>
          <textarea
            id={inputId}
            value={code}
            onChange={(event) => {
              setCode(event.target.value)
              setPreview(false)
            }}
            spellCheck={false}
            rows={8}
          />
          <button
            type="button"
            onClick={() => acceptCode(code)}
            disabled={code === acceptedCode}
          >
            Confirm
          </button>
          {code !== acceptedCode && <output>尚未確認變更</output>}
          <button
            type="button"
            onClick={() => acceptCode('')}
            disabled={!code && !acceptedCode}
          >
            移除
          </button>
        </div>
      )}
      <button
        type="button"
        disabled={!code.trim()}
        onClick={() => {
          if (preview) {
            setPreview(false)
          } else if (confirmEmbeddedCodeTrust(code)) {
            setPreview(true)
          }
        }}
      >
        {preview ? '關閉預覽' : '預覽'}
      </button>
      {preview && code && (
        <div className="embedded-code-editor__preview">
          <EmbeddedCodeDisplayMode
            embeddedCode={code}
            layout="default"
            caption=""
            showLoading={false}
          />
        </div>
      )}
    </div>
  )
}
