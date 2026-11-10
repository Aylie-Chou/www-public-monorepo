import { useId, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import {
  $createEmbeddedCodeNode,
  $isEmbeddedCodeNode,
} from '../plugins/EmbeddedCodePlugin/nodes/EmbeddedCodeNode'
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
  const [preview, setPreview] = useState(false)

  const updateCode = (value: string) => {
    setCode(value)
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
            onChange={(event) => updateCode(event.target.value)}
            spellCheck={false}
            rows={8}
          />
          <button type="button" onClick={() => setPreview(!preview)}>
            {preview ? '關閉預覽' : '預覽'}
          </button>
          <button type="button" onClick={() => updateCode('')} disabled={!code}>
            移除
          </button>
        </div>
      )}
      {(readOnly || preview) && code && (
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
