import { TOGGLE_LINK_COMMAND } from '@lexical/link'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension'
import type { HeadingTagType } from '@lexical/rich-text'
import {
  COMMAND_PRIORITY_NORMAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  type LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical'
import { type Dispatch, useEffect } from 'react'

import { useToolbarState } from '../../context/ToolbarContext'
import { sanitizeUrl } from '../../utils/url'
import {
  clearFormatting,
  formatBulletList,
  formatCheckList,
  formatHeading,
  formatNumberedList,
  formatParagraph,
} from '../ToolbarPlugin/utils'
import {
  isCapitalize,
  isCenterAlign,
  isClearFormatting,
  isFormatBulletList,
  isFormatCheckList,
  isFormatHeading,
  isFormatNumberedList,
  isFormatParagraph,
  isIndent,
  isInsertCodeBlock,
  isInsertDivider,
  isInsertEmbeddedCode,
  isInsertInfobox,
  isInsertImageFromDb,
  isInsertLink,
  isInsertQuote,
  isInsertSlideShow,
  isJustifyAlign,
  isLeftAlign,
  isLowercase,
  isOutdent,
  isRightAlign,
  isStrikeThrough,
  isSubscript,
  isSuperscript,
  isUppercase,
} from './shortcuts'
import type { EditorFeatureConfig } from '../../../core'
import { useImageConfig } from '../../context/ImageConfigContext'
import {
  OPEN_EMBEDDED_CODE_DIALOG_COMMAND,
  OPEN_IMAGE_FROM_DB_DIALOG_COMMAND,
  OPEN_SLIDE_SHOW_DIALOG_COMMAND,
} from '../ToolbarPlugin/command'
import { WWW_QUOTE_ADD_COMMAND } from '../QuotePlugin/command'
import { INFOBOX_ADD_COMMAND } from '../InfoboxPlugin/command'

export default function ShortcutsPlugin({
  editor,
  features,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor
  features?: EditorFeatureConfig
  setIsLinkEditMode: Dispatch<boolean>
}): null {
  const { toolbarState } = useToolbarState()
  const imageConfig = useImageConfig()
  const enableImage = features?.image !== false
  const enableEmbeddedCode = features?.embeddedCode !== false
  const enableImageFromDb =
    enableImage && imageConfig?.imageFromDb !== undefined
  const enableWwwQuote = features?.quote !== false
  const enableInfobox = features?.infobox !== false
  const enableDivider = features?.divider !== false
  const enableH4 = features?.h4 !== false
  const enableSlideShow =
    features?.slideShow !== false && imageConfig?.imageFromDb !== undefined

  useEffect(() => {
    const keyboardShortcutsHandler = (payload: KeyboardEvent) => {
      const event: KeyboardEvent = payload

      if (isFormatParagraph(event)) {
        event.preventDefault()
        formatParagraph(editor)
      } else if (isFormatHeading(event)) {
        const { code } = event
        const headingSize = `h${code[code.length - 1]}` as HeadingTagType
        if (headingSize === 'h4' && !enableH4) {
          return false
        }

        event.preventDefault()
        formatHeading(editor, toolbarState.blockType, headingSize)
      } else if (isFormatBulletList(event)) {
        event.preventDefault()
        formatBulletList(editor, toolbarState.blockType)
      } else if (isFormatNumberedList(event)) {
        event.preventDefault()
        formatNumberedList(editor, toolbarState.blockType)
      } else if (isFormatCheckList(event)) {
        event.preventDefault()
        formatCheckList(editor, toolbarState.blockType)
      } else if (isStrikeThrough(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
      } else if (isLowercase(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')
      } else if (isUppercase(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')
      } else if (isCapitalize(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')
      } else if (isIndent(event)) {
        event.preventDefault()
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
      } else if (isOutdent(event)) {
        event.preventDefault()
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
      } else if (isCenterAlign(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
      } else if (isLeftAlign(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
      } else if (isRightAlign(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
      } else if (isJustifyAlign(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
      } else if (isSubscript(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
      } else if (isSuperscript(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
      } else if (isInsertCodeBlock(event)) {
        event.preventDefault()
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      } else if (isClearFormatting(event)) {
        event.preventDefault()
        clearFormatting(editor)
      } else if (isInsertLink(event)) {
        event.preventDefault()
        const url = toolbarState.isLink ? null : sanitizeUrl('https://')
        setIsLinkEditMode(!toolbarState.isLink)

        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
      } else if (enableEmbeddedCode && isInsertEmbeddedCode(event)) {
        event.preventDefault()
        editor.dispatchCommand(OPEN_EMBEDDED_CODE_DIALOG_COMMAND, undefined)
      } else if (enableImageFromDb && isInsertImageFromDb(event)) {
        event.preventDefault()
        editor.dispatchCommand(OPEN_IMAGE_FROM_DB_DIALOG_COMMAND, undefined)
      } else if (enableSlideShow && isInsertSlideShow(event)) {
        event.preventDefault()
        editor.dispatchCommand(OPEN_SLIDE_SHOW_DIALOG_COMMAND, undefined)
      } else if (enableWwwQuote && isInsertQuote(event)) {
        event.preventDefault()
        editor.dispatchCommand(WWW_QUOTE_ADD_COMMAND, undefined)
      } else if (enableInfobox && isInsertInfobox(event)) {
        event.preventDefault()
        editor.dispatchCommand(INFOBOX_ADD_COMMAND, undefined)
      } else if (enableDivider && isInsertDivider(event)) {
        event.preventDefault()
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }

      return false
    }

    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      keyboardShortcutsHandler,
      COMMAND_PRIORITY_NORMAL
    )
  }, [
    editor,
    toolbarState.isLink,
    toolbarState.blockType,
    enableEmbeddedCode,
    enableImageFromDb,
    enableWwwQuote,
    enableInfobox,
    enableDivider,
    enableH4,
    enableSlideShow,
    setIsLinkEditMode,
  ])

  return null
}
