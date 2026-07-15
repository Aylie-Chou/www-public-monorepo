import {
  $applyNodeReplacement,
  addClassNamesToElement,
  type LexicalNode,
  DecoratorNode,
  type NodeKey,
  $getNodeByKey,
  type EditorConfig,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  type ReactNode,
  type FC,
  useEffect,
  useState
} from 'react'
// components
import ImageEditMode from '../components/ImageEditMode'
import ImageDisplayMode from '../components/ImageDisplayMode'
import ImageSkeleton from '../components/ImageSkeleton'
// type
import {
  IMAGE_LAYOUTS,
  isImageSource,
  type ImageLayout,
  type ImageSource,
} from '../constant'
// global var
const imageNodeType = 'image'

function getLayoutFromElement(element: HTMLElement): ImageLayout {
  const layoutElement = element.classList.contains('Image__image_block')
    ? element
    : element.querySelector<HTMLElement>('.Image__image_block')

  const layoutClass = IMAGE_LAYOUTS.find((layout) =>
    layoutElement?.classList.contains(layout) || element.classList.contains(layout)
  )

  return layoutClass ?? 'default'
}

export function $convertImageElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const image = domNode.matches('img')
    ? (domNode as HTMLImageElement)
    : domNode.querySelector<HTMLImageElement>('img')

  const imageUrl = image?.getAttribute('src')?.trim()
  if (!image || !imageUrl) {
    return null
  }

  const caption =
    domNode.querySelector<HTMLElement>('figcaption')?.textContent ?? ''
  const imageTitle =
    domNode.getAttribute('data-lexical-image-title') ??
    image.getAttribute('title') ??
    ''
  const imageSourceAttr = domNode.getAttribute('data-lexical-image-source')
  const imageSource = isImageSource(imageSourceAttr) ? imageSourceAttr : 'link'

  return {
    node: $createImageNode(
      imageUrl,
      getLayoutFromElement(domNode),
      caption,
      imageTitle,
      imageSource
    ),
  }
}

type ImageProps = {
  nodeKey: string
  imageCaption?: string
  imageUrl: string
  imageLayout?: ImageLayout
  imageTitle?: string
  imageSource?: ImageSource
  isLoading?: boolean
}
const Image: FC<ImageProps> = ({
  nodeKey,
  imageCaption = '',
  imageUrl,
  imageLayout = 'default',
  imageTitle = '',
  imageSource = 'link',
  isLoading = false,
}) => {
  const [editor] = useLexicalComposerContext()
  const [editable, setEditable] = useState(() => editor.isEditable())

  useEffect(() => {
    return editor.registerEditableListener((currentEditable) => {
      setEditable(currentEditable)
    })
  }, [editor])

  const updateLayout = (layout: ImageLayout) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setLayout(layout)
      }
    })
  }

  const confirm = (url: string, layout: ImageLayout, caption: string, title?: string) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.updateContent({
          caption,
          layout,
          title,
          url,
        })
      }
    })

    return
  }

  const deleteImage = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.remove()
      }
    })
  }

  if (isLoading) {
    return <ImageSkeleton layout={imageLayout} />
  }

  return (
    <>
      { editable ?
        <ImageEditMode
          imageUrl={imageUrl}
          layout={imageLayout}
          caption={imageCaption}
          imageTitle={imageTitle}
          imageSource={imageSource}
          onConfirm={confirm}
          onDelete={deleteImage}
          onUpdateLayout={updateLayout}
        /> :
        <ImageDisplayMode
          imageUrl={imageUrl}
          layout={imageLayout}
          caption={imageCaption}
          imageSource={imageSource}
        />
      }
    </>
  )
}

type SerializedImageNode = {
  type: typeof imageNodeType
  version: 1
  imageLayout: ImageLayout
  imageUrl: string
  caption: string
  imageTitle?: string
  imageSource?: ImageSource
  isLoading?: boolean
}

export class ImageNode extends DecoratorNode<ReactNode> {
  __imageUrl: string
  __imageLayout: ImageLayout
  __caption: string
  __imageTitle: string
  __imageSource: ImageSource
  __isLoading: boolean

  static override getType(): string {
    return imageNodeType
  }

  static override clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__imageUrl,
      node.__imageLayout,
      node.__caption,
      node.__imageTitle,
      node.__imageSource,
      node.__isLoading,
      node.__key
    )
  }

  constructor(
    url: string,
    layout: ImageLayout,
    caption: string,
    imageTitle: string = '',
    imageSource: ImageSource = 'link',
    isLoading: boolean = false,
    key?: NodeKey,
  ) {
    super(key)
    this.__imageUrl = url
    this.__imageLayout = layout
    this.__caption = caption
    this.__imageTitle = imageTitle
    this.__imageSource = imageSource
    this.__isLoading = isLoading
  }

  override isInline(): false {
    return false
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const themeClass = config.theme.image ?? 'TwreporterTheme__image'
    const div = document.createElement('div')
    addClassNamesToElement(
      div,
      themeClass,
      'Image__content',
      this.__imageLayout
    )

    return div
  }

  override updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    if (prevNode.__imageLayout !== this.__imageLayout) {
      dom.classList.remove(prevNode.__imageLayout)
      dom.classList.add(this.__imageLayout)
    }

    return false
  }

  static override importDOM(): DOMConversionMap<HTMLElement> | null {
    return {
      div: (domNode: HTMLElement) => {
        if (
          !domNode.classList.contains('Image__container') &&
          !domNode.classList.contains('Image__content')
        ) {
          return null
        }

        return {
          conversion: $convertImageElement,
          priority: 2,
        }
      },
      figure: () => ({
        conversion: $convertImageElement,
        priority: 1,
      }),
      img: () => ({
        conversion: $convertImageElement,
        priority: 1,
      }),
    }
  }

  override exportDOM(): DOMExportOutput {
    if (this.__isLoading || !this.__imageUrl) {
      return { element: null }
    }

    const container = document.createElement('div')
    container.classList.add('Image__container', this.__imageLayout)
    container.setAttribute('data-lexical-image-source', this.__imageSource)
    if (this.__imageTitle) {
      container.setAttribute('data-lexical-image-title', this.__imageTitle)
    }

    const imageBlock = document.createElement('div')
    imageBlock.classList.add('Image__image_block', this.__imageLayout)

    const figure = document.createElement('figure')
    figure.setAttribute('itemscope', '')
    figure.setAttribute('itemtype', 'http://schema.org/ImageObject')

    const image = document.createElement('img')
    image.src = this.__imageUrl
    image.alt = this.__caption
    image.setAttribute('aria-label', this.__caption)
    image.classList.add('Image__image')
    if (this.__imageTitle) {
      image.title = this.__imageTitle
    }
    figure.append(image)

    if (this.__caption) {
      const figcaption = document.createElement('figcaption')
      figcaption.classList.add('Image__caption')
      figcaption.textContent = this.__caption
      figure.append(figcaption)
    }

    imageBlock.append(figure)
    container.append(imageBlock)

    return { element: container }
  }

  override decorate(): ReactNode {
    return (
      <Image
        nodeKey={this.getKey()}
        imageUrl={this.__imageUrl}
        imageLayout={this.__imageLayout}
        imageCaption={this.__caption}
        imageTitle={this.__imageTitle}
        imageSource={this.__imageSource}
        isLoading={this.__isLoading}
      />
    )
  }

  static override importJSON(serializedNode: SerializedImageNode) {
    return $createImageNode(
      serializedNode.imageUrl,
      serializedNode.imageLayout,
      serializedNode.caption,
      serializedNode.imageTitle,
      serializedNode.imageSource,
      serializedNode.isLoading
    )
  }

  override exportJSON(): SerializedImageNode {
    return {
      type: imageNodeType,
      version: 1,
      imageUrl: this.__imageUrl,
      imageLayout: this.__imageLayout,
      caption: this.__caption,
      imageTitle: this.__imageTitle,
      imageSource: this.__imageSource,
      isLoading: this.__isLoading,
    }
  }

  getUrl(): string {
    const self = this.getLatest()
    return self.__imageUrl
  }

  isLoading(): boolean {
    const self = this.getLatest()
    return self.__isLoading
  }

  setUrl(url: string) {
    const write = this.getWritable()
    write.__imageUrl = url
  }

  setLayout(layout: ImageLayout): void {
    const writable = this.getWritable()
    writable.__imageLayout = layout
  }

  updateContent({
    caption,
    layout,
    title,
    url,
  }: {
    caption: string
    layout: ImageLayout
    title?: string | undefined
    url: string
  }): void {
    const writable = this.getWritable()
    writable.__caption = caption
    writable.__imageUrl = url
    writable.__imageLayout = layout
    writable.__imageTitle = title ?? ''
  }

  finishUpload({
    title = '',
    url,
  }: {
    title?: string
    url: string
  }): void {
    const writable = this.getWritable()
    writable.__imageUrl = url
    writable.__imageTitle = title
    writable.__imageSource = 'drag-drop'
    writable.__isLoading = false
  }
}

export function $createImageNode(
  url: string,
  layout: ImageLayout,
  caption: string,
  imageTitle: string = '',
  imageSource: ImageSource = 'link',
  isLoading: boolean = false
): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      url,
      layout,
      caption,
      imageTitle,
      imageSource,
      isLoading
    )
  )
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
