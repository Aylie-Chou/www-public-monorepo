import {
  $applyNodeReplacement,
  addClassNamesToElement,
  ElementNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
} from 'lexical'

import {
  isWwwQuoteLayout,
  type WwwQuoteLayout,
} from '../constant'

const wwwQuoteNodeType = 'www-quote'
const wwwQuoteAttribute = 'data-lexical-www-quote'

export type SerializedWwwQuoteNode = Spread<
  {
    layout: WwwQuoteLayout
  },
  SerializedElementNode
>

function getLayoutFromElement(element: HTMLElement): WwwQuoteLayout {
  const layout = element.getAttribute('data-layout')
  return isWwwQuoteLayout(layout) ? layout : 'default'
}

export function $convertWwwQuoteElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  return {
    node: $createWwwQuoteNode(getLayoutFromElement(domNode)),
  }
}

export class WwwQuoteNode extends ElementNode {
  __layout: WwwQuoteLayout

  static override getType(): string {
    return wwwQuoteNodeType
  }

  static override clone(node: WwwQuoteNode): WwwQuoteNode {
    return new WwwQuoteNode(node.__layout, node.__key)
  }

  constructor(layout: WwwQuoteLayout = 'default', key?: NodeKey) {
    super(key)
    this.__layout = layout
  }

  override isInline(): false {
    return false
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const themeClass = config.theme.wwwQuote ?? 'TwreporterTheme__wwwQuote'
    const figure = document.createElement('figure')
    addClassNamesToElement(
      figure,
      themeClass,
      'wwwQuote__container',
      this.__layout
    )
    figure.setAttribute(wwwQuoteAttribute, 'true')
    figure.setAttribute('data-layout', this.__layout)
    return figure
  }

  override updateDOM(prevNode: WwwQuoteNode, dom: HTMLElement): boolean {
    if (prevNode.__layout !== this.__layout) {
      dom.classList.remove(prevNode.__layout)
      dom.classList.add(this.__layout)
      dom.setAttribute('data-layout', this.__layout)
    }

    return false
  }

  static override importDOM(): DOMConversionMap<HTMLElement> | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(wwwQuoteAttribute)) {
          return null
        }
        return {
          conversion: $convertWwwQuoteElement,
          priority: 2,
        }
      },
      figure: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute(wwwQuoteAttribute)) {
          return null
        }
        return {
          conversion: $convertWwwQuoteElement,
          priority: 2,
        }
      },
    }
  }

  override exportDOM(): DOMExportOutput {
    const figure = document.createElement('figure')
    figure.classList.add('wwwQuote__container', this.__layout)
    figure.setAttribute(wwwQuoteAttribute, 'true')
    figure.setAttribute('data-layout', this.__layout)
    return { element: figure }
  }

  static override importJSON(
    serializedNode: SerializedWwwQuoteNode
  ): WwwQuoteNode {
    return $createWwwQuoteNode(serializedNode.layout).updateFromJSON(
      serializedNode
    )
  }

  override exportJSON(): SerializedWwwQuoteNode {
    return {
      ...super.exportJSON(),
      layout: this.__layout,
    }
  }

  getLayout(): WwwQuoteLayout {
    return this.getLatest().__layout
  }

  setLayout(layout: WwwQuoteLayout): void {
    const writable = this.getWritable()
    writable.__layout = layout
  }
}

export function $createWwwQuoteNode(
  layout: WwwQuoteLayout = 'default'
): WwwQuoteNode {
  return $applyNodeReplacement(new WwwQuoteNode(layout))
}

export function $isWwwQuoteNode(
  node: LexicalNode | null | undefined
): node is WwwQuoteNode {
  return node instanceof WwwQuoteNode
}
