import {
  $applyNodeReplacement,
  $getNodeByKey,
  DecoratorNode,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { addClassNamesToElement } from '@lexical/utils'
import { type FC, type ReactNode, useEffect, useState } from 'react'

import EmbeddedCodeDisplayMode from '../components/EmbeddedCodeDisplayMode'
import EmbeddedCodeEditMode from '../components/EmbeddedCodeEditMode'
import type { EmbeddedCodeLayout } from '../types'

const embeddedCodeNodeType = 'embedded-code'

type EmbeddedCodeProps = {
  nodeKey: string
  embeddedCode: string
  caption?: string
  layout?: EmbeddedCodeLayout
  showLoading?: boolean
}

const EmbeddedCode: FC<EmbeddedCodeProps> = ({
  nodeKey,
  embeddedCode,
  caption = '',
  layout = 'default',
  showLoading = false,
}) => {
  const [editor] = useLexicalComposerContext()
  const [editable, setEditable] = useState(() => editor.isEditable())

  useEffect(() => {
    return editor.registerEditableListener((currentEditable) => {
      setEditable(currentEditable)
    })
  }, [editor])

  const confirm = (
    nextEmbeddedCode: string,
    nextLayout: EmbeddedCodeLayout,
    nextCaption: string,
    nextShowLoading: boolean
  ) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isEmbeddedCodeNode(node)) {
        node.updateContent({
          embeddedCode: nextEmbeddedCode,
          layout: nextLayout,
          caption: nextCaption,
          showLoading: nextShowLoading,
        })
      }
    })
  }

  const deleteEmbeddedCode = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isEmbeddedCodeNode(node)) {
        node.remove()
      }
    })
  }

  return editable ? (
    <EmbeddedCodeEditMode
      embeddedCode={embeddedCode}
      layout={layout}
      caption={caption}
      showLoading={showLoading}
      onConfirm={confirm}
      onDelete={deleteEmbeddedCode}
    />
  ) : (
    <EmbeddedCodeDisplayMode
      embeddedCode={embeddedCode}
      layout={layout}
      caption={caption}
      showLoading={showLoading}
    />
  )
}

type SerializedEmbeddedCodeNode = {
  type: typeof embeddedCodeNodeType
  version: 1
  embeddedCode: string
  caption: string
  layout: EmbeddedCodeLayout
  showLoading?: boolean
}

export class EmbeddedCodeNode extends DecoratorNode<ReactNode> {
  __embeddedCode: string
  __caption: string
  __layout: EmbeddedCodeLayout
  __showLoading: boolean

  static override getType(): string {
    return embeddedCodeNodeType
  }

  static override clone(node: EmbeddedCodeNode): EmbeddedCodeNode {
    return new EmbeddedCodeNode(
      node.__embeddedCode,
      node.__layout,
      node.__caption,
      node.__showLoading,
      node.__key
    )
  }

  constructor(
    embeddedCode: string,
    layout: EmbeddedCodeLayout,
    caption: string = '',
    showLoading: boolean = false,
    key?: NodeKey
  ) {
    super(key)
    this.__embeddedCode = embeddedCode
    this.__layout = layout
    this.__caption = caption
    this.__showLoading = showLoading
  }

  override isInline(): false {
    return false
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const themeClass =
      config.theme.embeddedCode ?? 'TwreporterTheme__embeddedCode'
    const div = document.createElement('div')
    addClassNamesToElement(
      div,
      themeClass,
      'EmbeddedCode__content',
      this.__layout
    )

    return div
  }

  override updateDOM(
    prevNode: EmbeddedCodeNode,
    dom: HTMLElement
  ): boolean {
    if (prevNode.__layout !== this.__layout) {
      dom.classList.remove(prevNode.__layout)
      dom.classList.add(this.__layout)
    }

    return false
  }

  override decorate(): ReactNode {
    return (
      <EmbeddedCode
        nodeKey={this.getKey()}
        embeddedCode={this.__embeddedCode}
        layout={this.__layout}
        caption={this.__caption}
        showLoading={this.__showLoading}
      />
    )
  }

  static override importJSON(serializedNode: SerializedEmbeddedCodeNode) {
    return $createEmbeddedCodeNode(
      serializedNode.embeddedCode,
      serializedNode.layout,
      serializedNode.caption,
      serializedNode.showLoading ?? false
    )
  }

  override exportJSON(): SerializedEmbeddedCodeNode {
    return {
      type: embeddedCodeNodeType,
      version: 1,
      embeddedCode: this.__embeddedCode,
      caption: this.__caption,
      layout: this.__layout,
      showLoading: this.__showLoading,
    }
  }

  updateContent({
    embeddedCode,
    caption,
    layout,
    showLoading,
  }: {
    embeddedCode: string
    caption: string
    layout: EmbeddedCodeLayout
    showLoading: boolean
  }): void {
    const writable = this.getWritable()
    writable.__embeddedCode = embeddedCode
    writable.__caption = caption
    writable.__layout = layout
    writable.__showLoading = showLoading
  }
}

export function $createEmbeddedCodeNode(
  embeddedCode: string,
  layout: EmbeddedCodeLayout,
  caption: string = '',
  showLoading: boolean = false
): EmbeddedCodeNode {
  return $applyNodeReplacement(
    new EmbeddedCodeNode(embeddedCode, layout, caption, showLoading)
  )
}

export function $isEmbeddedCodeNode(
  node: LexicalNode | null | undefined
): node is EmbeddedCodeNode {
  return node instanceof EmbeddedCodeNode
}
