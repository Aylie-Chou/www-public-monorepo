import {
  $applyNodeReplacement,
  ElementNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type SerializedElementNode,
} from 'lexical'
import { addClassNamesToElement } from '@lexical/utils'

const infoboxNodeType = 'infobox'
const infoboxAttribute = 'data-lexical-infobox'

export type SerializedInfoboxNode = SerializedElementNode

export function $convertInfoboxElement(
  _domNode: HTMLElement
): DOMConversionOutput | null {
  return {
    node: $createInfoboxNode(),
  }
}

export class InfoboxNode extends ElementNode {
  static override getType(): string {
    return infoboxNodeType
  }

  static override clone(node: InfoboxNode): InfoboxNode {
    return new InfoboxNode(node.__key)
  }

  override isInline(): false {
    return false
  }

  override isShadowRoot(): true {
    return true
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const themeClass = config.theme.infobox ?? 'TwreporterTheme__infobox'
    const div = document.createElement('div')
    addClassNamesToElement(div, themeClass, 'Infobox__container')
    div.setAttribute(infoboxAttribute, 'true')
    return div
  }

  override updateDOM(): boolean {
    return false
  }

  static override importDOM(): DOMConversionMap<HTMLElement> | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(infoboxAttribute)) {
          return null
        }
        return {
          conversion: $convertInfoboxElement,
          priority: 2,
        }
      },
    }
  }

  override exportDOM(): DOMExportOutput {
    const div = document.createElement('div')
    div.classList.add('Infobox__container')
    div.setAttribute(infoboxAttribute, 'true')
    return { element: div }
  }

  static override importJSON(
    serializedNode: SerializedInfoboxNode
  ): InfoboxNode {
    return $createInfoboxNode().updateFromJSON(serializedNode)
  }
}

export function $createInfoboxNode(): InfoboxNode {
  return $applyNodeReplacement(new InfoboxNode())
}

export function $isInfoboxNode(
  node: LexicalNode | null | undefined
): node is InfoboxNode {
  return node instanceof InfoboxNode
}
