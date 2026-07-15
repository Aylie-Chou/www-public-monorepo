import {
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type EditorConfig,
  type LexicalEditor,
  type DOMConversionMap,
  type DOMConversionOutput,
  type SerializedElementNode,
  type Spread,
  type DOMExportOutput,
} from 'lexical'
import { addClassNamesToElement } from '@lexical/utils'

// type

type SerializedAnnotationNode = Spread<
  {
    open: boolean
  },
  SerializedElementNode
>

export function $convertDetailsElement(
  domNode: HTMLDetailsElement
): DOMConversionOutput | null {
  const isOpen = domNode.open !== undefined ? domNode.open : true
  const node = $createAnnotationNode(isOpen)
  return {
    node,
  }
}

export class AnnotationNode extends ElementNode {
  __open: boolean

  constructor(open: boolean, key?: NodeKey) {
    super(key)
    this.__open = open
  }

  static override getType() {
    return 'annotation'
  }

  static override clone(node: AnnotationNode): AnnotationNode {
    return new AnnotationNode(node.__open, node.__key)
  }

  override isInline(): true {
    return true
  }

  override createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const detailsDom = document.createElement('details')
    detailsDom.open = this.__open
    detailsDom.addEventListener('toggle', () => {
      const open = editor.getEditorState().read(() => this.getOpen())
      if (open !== detailsDom.open) {
        editor.update(() => this.toggleOpen())
      }

      if (open) {
        detailsDom.classList.add('open')
      } else {
        detailsDom.classList.remove('open')
      }
    })
    const annotationClass =
      config.theme.annotation ?? 'TwreporterTheme__annotation'
    addClassNamesToElement(
      detailsDom,
      annotationClass,
      'Annotation__container'
    )

    return detailsDom
  }

  override updateDOM(prevNode: this, dom: HTMLDetailsElement): boolean {
    const currentOpen = this.__open
    const prevOpen = prevNode.__open
    if (prevOpen !== currentOpen) {
      dom.open = currentOpen
    }

    return false
  }

  static override importDOM(): DOMConversionMap<HTMLDetailsElement> | null {
    return {
      details: (_domNode: HTMLDetailsElement) => {
        return {
          conversion: $convertDetailsElement,
          priority: 1,
        }
      },
    }
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement('details')
    element.classList.add('Annotation__container')
    if (this.__open) {
      element.setAttribute('open', '')
    }
    return { element }
  }

  static override importJSON(serializedNode: SerializedAnnotationNode): AnnotationNode {
    return $createAnnotationNode(serializedNode.open).updateFromJSON(
      serializedNode
    )
  }

  override exportJSON(): SerializedAnnotationNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
    }
  }

  getOpen(): boolean {
    return this.getLatest().__open
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable()
    writable.__open = open
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen())
  }
}

export function $createAnnotationNode(isOpen: boolean): AnnotationNode {
  return new AnnotationNode(isOpen)
}

export function $isAnnotationNode(
  node: LexicalNode | null | undefined
): node is AnnotationNode {
  return node instanceof AnnotationNode
}
