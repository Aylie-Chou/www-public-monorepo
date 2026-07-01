import { useState, type JSX } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
// official plugins
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
// local plugins
import ShortcutsPlugin from '../plugins/ShortcutsPlugin'
import ToolbarPlugin from '../plugins/ToolbarPlugin'
import LinkPlugin from '../plugins/LinkPlugin'
import FloatingLinkEditorPlugin from '../plugins/FloatingLinkEditorPlugin'
import AnnotationPlugin from '../plugins/AnnotationPlugin'
import EmbeddedCodePlugin from '../plugins/EmbeddedCodePlugin'
import ImagePlugin from '../plugins/ImagePlugin'
import InfoboxPlugin from '../plugins/InfoboxPlugin'
import DragDropImagePlugin from '../plugins/ImagePlugin/DragDropImagePlugin'
import QuotePlugin from '../plugins/QuotePlugin'
import SlideShowPlugin from '../plugins/SlideShowPlugin'
import DividerPlugin from '../plugins/DividerPlugin'
// components
import ContentEditable from './ContentEditable'
// types
import type { LexicalEditorProps } from '../../core'

type EditorInnerProps = {
  config: LexicalEditorProps['config']
  placeholder: string
}

export default function Editor({
  config,
  placeholder,
}: EditorInnerProps): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  const showToolbar = config?.ui?.toolbar ?? false
  const listStrictIndent = false
  // Basic CMS features are intentionally always enabled in v1: h2/h3,
  // ordered/unordered lists, inline text formatting, link, colors,
  // fullscreen, and preview.
  const enableAnnotation = config.features?.annotation !== false
  const enableImage = config.features?.image !== false
  const enableEmbeddedCode = config.features?.embeddedCode !== false
  const enableQuote = config.features?.quote !== false
  const enableInfobox = config.features?.infobox !== false
  const enableDivider = config.features?.divider !== false
  const enableSlideShow =
    config.features?.slideShow !== false &&
    config.image?.imageFromDb !== undefined

  // editor-fullscreen-scroller is for storytelling components
  return (
    <div
      className={`editor-shell ${isFullscreen ? 'fullscreen editor-fullscreen-scroller' : ''}`}
    >
      {showToolbar ? (
        <ToolbarPlugin
          editor={editor}
          activeEditor={activeEditor}
          config={config.theme}
          {...(config.features ? { features: config.features } : {})}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          setActiveEditor={setActiveEditor}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      ) : null}
      <ShortcutsPlugin
        editor={activeEditor}
        {...(config.features ? { features: config.features } : {})}
        setIsLinkEditMode={setIsLinkEditMode}
      />
      <div className={`editor-container`}>
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable placeholder={placeholder} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LinkPlugin />
        <ListPlugin hasStrictIndent={listStrictIndent} />
        {floatingAnchorElem && (
          <FloatingLinkEditorPlugin
            anchorElem={floatingAnchorElem}
            isLinkEditMode={isLinkEditMode}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        )}
        {enableAnnotation && <AnnotationPlugin />}
        {enableQuote && <QuotePlugin />}
        {enableInfobox && <InfoboxPlugin />}
        {enableDivider && <DividerPlugin />}
        {enableEmbeddedCode && <EmbeddedCodePlugin />}
        {enableImage && <ImagePlugin />}
        {enableSlideShow && <SlideShowPlugin />}
        {enableImage && config.uploadImage && (
          <DragDropImagePlugin uploadImage={config.uploadImage} />
        )}
      </div>
    </div>
  )
}
