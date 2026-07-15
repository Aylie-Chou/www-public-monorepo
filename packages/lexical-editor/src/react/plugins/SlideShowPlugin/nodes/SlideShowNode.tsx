import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $applyNodeReplacement,
  $getNodeByKey,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
} from 'lexical'
import { addClassNamesToElement } from '@lexical/utils'
import { type FC, type ReactNode, useEffect, useState } from 'react'

import SlideShowDisplayMode from '../components/SlideShowDisplayMode'
import SlideShowEditMode from '../components/SlideShowEditMode'
import type { SlideShowSlide } from '../types'
import { normalizeSlideShowSlides } from '../utils'

const slideShowNodeType = 'slide-show'

type SerializedSlideShowNode = {
  type: typeof slideShowNodeType
  version: 1
  slides: SlideShowSlide[]
}

function $convertSlideShowElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const slideElements = Array.from(
    domNode.querySelectorAll<HTMLElement>('.SlideShow__slide')
  )
  const slides = slideElements
    .map((slideElement) => {
      const image = slideElement.querySelector<HTMLImageElement>('img')
      return {
        url: image?.getAttribute('src')?.trim() ?? '',
        caption:
          slideElement.querySelector<HTMLElement>('figcaption')?.textContent ??
          '',
      }
    })
    .filter((slide) => slide.url.length > 0)

  if (slides.length === 0) {
    return null
  }

  return {
    node: $createSlideShowNode(slides),
  }
}

type SlideShowProps = {
  nodeKey: string
  slides: SlideShowSlide[]
}

const SlideShow: FC<SlideShowProps> = ({ nodeKey, slides }) => {
  const [editor] = useLexicalComposerContext()
  const [editable, setEditable] = useState(() => editor.isEditable())

  useEffect(() => {
    return editor.registerEditableListener((currentEditable) => {
      setEditable(currentEditable)
    })
  }, [editor])

  const confirm = (nextSlides: SlideShowSlide[]) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isSlideShowNode(node)) {
        node.updateSlides(nextSlides)
      }
    })
  }

  const deleteSlideShow = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isSlideShowNode(node)) {
        node.remove()
      }
    })
  }

  return editable ? (
    <SlideShowEditMode
      slides={slides}
      onConfirm={confirm}
      onDelete={deleteSlideShow}
    />
  ) : (
    <SlideShowDisplayMode slides={slides} />
  )
}

export class SlideShowNode extends DecoratorNode<ReactNode> {
  __slides: SlideShowSlide[]

  static override getType(): string {
    return slideShowNodeType
  }

  static override clone(node: SlideShowNode): SlideShowNode {
    return new SlideShowNode(node.__slides, node.__key)
  }

  constructor(slides: SlideShowSlide[], key?: NodeKey) {
    super(key)
    this.__slides = normalizeSlideShowSlides(slides)
  }

  override isInline(): false {
    return false
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const themeClass = config.theme.slideshow ?? 'TwreporterTheme__slideshow'
    const div = document.createElement('div')
    addClassNamesToElement(div, themeClass, 'SlideShow__content')
    return div
  }

  override updateDOM(): boolean {
    return false
  }

  static override importDOM(): DOMConversionMap<HTMLElement> | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.classList.contains('SlideShow__container')) {
          return null
        }

        return {
          conversion: $convertSlideShowElement,
          priority: 2,
        }
      },
    }
  }

  override exportDOM(): DOMExportOutput {
    const slides = normalizeSlideShowSlides(this.__slides)

    if (slides.length === 0) {
      return { element: null }
    }

    const container = document.createElement('div')
    container.classList.add('SlideShow__container')

    const track = document.createElement('div')
    track.classList.add('SlideShow__export_slides')

    slides.forEach((slide, index) => {
      const figure = document.createElement('figure')
      figure.classList.add('SlideShow__slide')
      figure.setAttribute('itemscope', '')
      figure.setAttribute('itemtype', 'http://schema.org/ImageObject')
      figure.setAttribute('data-slide-index', String(index + 1))

      const image = document.createElement('img')
      image.src = slide.url
      image.alt = slide.caption
      image.setAttribute('aria-label', slide.caption)
      image.classList.add('SlideShow__image')
      figure.append(image)

      if (slide.caption) {
        const figcaption = document.createElement('figcaption')
        figcaption.classList.add('SlideShow__caption')
        figcaption.textContent = slide.caption
        figure.append(figcaption)
      }

      track.append(figure)
    })

    container.append(track)
    return { element: container }
  }

  override decorate(): ReactNode {
    return <SlideShow nodeKey={this.getKey()} slides={this.__slides} />
  }

  static override importJSON(serializedNode: SerializedSlideShowNode) {
    return $createSlideShowNode(serializedNode.slides)
  }

  override exportJSON(): SerializedSlideShowNode {
    return {
      type: slideShowNodeType,
      version: 1,
      slides: this.__slides,
    }
  }

  updateSlides(slides: SlideShowSlide[]): void {
    const writable = this.getWritable()
    writable.__slides = normalizeSlideShowSlides(slides)
  }
}

export function $createSlideShowNode(slides: SlideShowSlide[]): SlideShowNode {
  return $applyNodeReplacement(new SlideShowNode(slides))
}

export function $isSlideShowNode(
  node: LexicalNode | null | undefined
): node is SlideShowNode {
  return node instanceof SlideShowNode
}
