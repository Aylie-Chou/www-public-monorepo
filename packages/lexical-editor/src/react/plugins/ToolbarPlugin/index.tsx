import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
  type JSX,
} from 'react'
// lexical
import { $isHeadingNode } from '@lexical/rich-text'
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from '@lexical/selection'
import {
  $findMatchingParent,
  mergeRegister,
  $getNearestNodeOfType,
} from '@lexical/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension'
import {
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $isElementNode,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical'
// context
import {
  blockTypeToBlockName,
  useToolbarState,
} from '../../context/ToolbarContext'
import { useImageConfig } from '../../context/ImageConfigContext'
// hook
import useModal from '../../hooks/useModal'
// util
import { clearFormatting } from './utils'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { sanitizeUrl } from '../../utils/url'
import { $isAnnotationNode } from '../AnnotationPlugin/nodes/AnnotationNode'
// component
import DropDown, { DropDownItem } from '../../components/DropDown'
import EmbeddedCodeEditDialog from '../EmbeddedCodePlugin/components/EmbeddedCodeEditDialog'
import ImageEditDialog from '../ImagePlugin/components/ImageEditDialog'
import ImageFromDbDialog from '../ImagePlugin/components/ImageFromDbDialog'
import SlideShowEditDialog from '../SlideShowPlugin/components/SlideShowEditDialog'
import { SHORTCUTS } from '../ShortcutsPlugin/shortcuts'
import Fullscreen from './components/Fullscreen'
import BlockFormatDropDown, {
  dropDownActiveClass,
} from './components/BlockFormatDropdown'
// custom command
import {
  ANNOTATION_ADD_COMMAND,
  ANNOTATION_REMOVE_COMMAND,
} from '../AnnotationPlugin/command'
import { IMAGE_ADD_COMMAND } from '../ImagePlugin/command'
import { EMBEDDED_CODE_ADD_COMMAND } from '../EmbeddedCodePlugin/command'
import { INFOBOX_ADD_COMMAND } from '../InfoboxPlugin/command'
import { WWW_QUOTE_ADD_COMMAND } from '../QuotePlugin/command'
import { SLIDE_SHOW_ADD_COMMAND } from '../SlideShowPlugin/command'
import {
  OPEN_EMBEDDED_CODE_DIALOG_COMMAND,
  OPEN_IMAGE_FROM_DB_DIALOG_COMMAND,
  OPEN_SLIDE_SHOW_DIALOG_COMMAND,
} from './command'
// types
import type { EditorFeatureConfig, EditorTheme } from '../../../core'
// css
import './Toolbar.scss'

function Divider(): JSX.Element {
  return <div className="divider" />
}

function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement =
    node.getKey() === 'root'
      ? node
      : $findMatchingParent(node, (e) => {
          const parent = e.getParent()
          return parent !== null && $isRootOrShadowRoot(parent)
        })

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow()
  }
  return topLevelElement
}

function $isWithinAnnotation(node: LexicalNode): boolean {
  return (
    $isAnnotationNode(node) ||
    $findMatchingParent(node, (parentNode) => $isAnnotationNode(parentNode)) !==
      null
  )
}

export default function ToolbarPlugin({
  editor,
  activeEditor,
  config,
  features,
  isFullscreen,
  setActiveEditor,
  setIsFullscreen,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor
  activeEditor: LexicalEditor
  config: EditorTheme
  features?: EditorFeatureConfig
  isFullscreen: boolean
  setActiveEditor: Dispatch<LexicalEditor>
  setIsFullscreen: Dispatch<SetStateAction<boolean>>
  setIsLinkEditMode: Dispatch<boolean>
}): JSX.Element {
  const [modal] = useModal()
  const [isEditable, setIsEditable] = useState(() => editor.isEditable())
  const { toolbarState, updateToolbarState } = useToolbarState()
  const imageConfig = useImageConfig()
  const enableAnnotation = features?.annotation !== false
  const enableImage = features?.image !== false
  const enableEmbeddedCode = features?.embeddedCode !== false
  const enableQuote = features?.quote !== false
  const enableInfobox = features?.infobox !== false
  const enableDivider = features?.divider !== false
  const enableH4 = features?.h4 !== false
  const enableImageFromDb =
    enableImage && imageConfig?.imageFromDb !== undefined
  const enableSlideShow =
    features?.slideShow !== false && imageConfig?.imageFromDb !== undefined
  const showInsertDropdown =
    enableImage ||
    enableEmbeddedCode ||
    enableQuote ||
    enableInfobox ||
    enableDivider ||
    enableSlideShow

  // custom plugin state
  const [isOpenEmbeddedCodeDialog, setIsOpenEmbeddedCodeDialog] =
    useState(false)
  const [isOpenImageDialog, setIsOpenImageDialog] = useState(false)
  const [isOpenImageFromDbDialog, setIsOpenImageFromDbDialog] = useState(false)
  const [isOpenSlideShowDialog, setIsOpenSlideShowDialog] = useState(false)

  const $handleHeadingNode = useCallback(
    (selectedElement: LexicalNode) => {
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType()

      if (type in blockTypeToBlockName) {
        updateToolbarState(
          'blockType',
          type as keyof typeof blockTypeToBlockName
        )
      }
    },
    [updateToolbarState]
  )

  const $updateToolbarFromSelection = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      updateToolbarState('isRTL', $isParentElementRTL(selection))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      const isLink = $isLinkNode(parent) || $isLinkNode(node)
      updateToolbarState('isLink', isLink)

      // update annotation
      const isAnnotated = $isWithinAnnotation(node)
      updateToolbarState('isAnnotated', isAnnotated)

      if (elementDOM !== null) {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType()
        if (type in blockTypeToBlockName) {
          updateToolbarState(
            'blockType',
            type as keyof typeof blockTypeToBlockName
          )
        }
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType()

          updateToolbarState('blockType', type)
        } else {
          $handleHeadingNode(element)
        }
      }

      // Handle buttons
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#404040')
      )
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          'transparent'
        )
      )
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(
          selection,
          'font-family',
          'Roboto Slab", "Noto Sans TC", sans-serif'
        )
      )

      let matchingParent: LexicalNode | null
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        )
        if (matchingParent) {
          // If matchingParent is a valid node, pass it's format type
          updateToolbarState(
            'elementFormat',
            $isElementNode(matchingParent)
              ? matchingParent.getFormatType()
              : $isElementNode(node)
                ? node.getFormatType()
                : parent?.getFormatType() || 'left'
          )
        }
      }
    }
    if ($isRangeSelection(selection)) {
      // Update text format
      updateToolbarState('isBold', selection.hasFormat('bold'))
      updateToolbarState('isItalic', selection.hasFormat('italic'))
      updateToolbarState('isUnderline', selection.hasFormat('underline'))
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough')
      )
      updateToolbarState('isSubscript', selection.hasFormat('subscript'))
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'))
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'))
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'))
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'))
    }
    if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes()
      for (const selectedNode of nodes) {
        const parentList = $getNearestNodeOfType<ListNode>(
          selectedNode,
          ListNode
        )
        if (parentList) {
          const type = parentList.getListType()
          updateToolbarState('blockType', type)
        } else {
          const selectedElement = $findTopLevelElement(selectedNode)
          $handleHeadingNode(selectedElement)
          // Update elementFormat for node selection (e.g., images)
          if ($isElementNode(selectedElement)) {
            updateToolbarState('elementFormat', selectedElement.getFormatType())
          }
        }
      }
    }
  }, [activeEditor, updateToolbarState, $handleHeadingNode])

  const updateToolbar = useCallback(
    (editorInstance: LexicalEditor = activeEditor) => {
      editorInstance.read(() => {
        $updateToolbarFromSelection()
      })
    },
    [activeEditor, $updateToolbarFromSelection]
  )

  const setEditorEditable = useCallback(
    (editable: boolean) => {
      editor.setEditable(editable)
      if (activeEditor !== editor) {
        activeEditor.setEditable(editable)
      }
    },
    [activeEditor, editor]
  )

  const togglePreview = useCallback(() => {
    setEditorEditable(!isEditable)
  }, [isEditable, setEditorEditable])

  const leavePreviewMode = useCallback(() => {
    if (!isEditable) {
      setEditorEditable(true)
    }
  }, [isEditable, setEditorEditable])

  const onToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      leavePreviewMode()
    }
    setIsFullscreen((current) => !current)
  }, [isFullscreen, leavePreviewMode, setIsFullscreen])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor)
        updateToolbar(newEditor)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbar, setActiveEditor])

  useEffect(() => {
    updateToolbar(activeEditor)
  }, [activeEditor, updateToolbar])

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),
      activeEditor.registerUpdateListener(() => {
        updateToolbar(activeEditor)
      })
    )
  }, [updateToolbar, activeEditor, editor])

  useEffect(() => {
    if (!enableEmbeddedCode) {
      return
    }

    return activeEditor.registerCommand(
      OPEN_EMBEDDED_CODE_DIALOG_COMMAND,
      () => {
        setIsOpenEmbeddedCodeDialog(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [activeEditor, enableEmbeddedCode])

  useEffect(() => {
    if (!enableImageFromDb) {
      return
    }

    return activeEditor.registerCommand(
      OPEN_IMAGE_FROM_DB_DIALOG_COMMAND,
      () => {
        setIsOpenImageFromDbDialog(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [activeEditor, enableImageFromDb])

  useEffect(() => {
    if (!enableSlideShow) {
      return
    }

    return activeEditor.registerCommand(
      OPEN_SLIDE_SHOW_DIALOG_COMMAND,
      () => {
        setIsOpenSlideShowDialog(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [activeEditor, enableSlideShow])

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection()
          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      )
    },
    [activeEditor]
  )

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack)
    },
    [applyStyleText]
  )

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack)
    },
    [applyStyleText]
  )

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      setIsLinkEditMode(false)
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink])

  const toggleAnnotation = useCallback(() => {
    if (toolbarState.isAnnotated) {
      activeEditor.dispatchCommand(ANNOTATION_REMOVE_COMMAND, undefined)
    } else {
      activeEditor.dispatchCommand(ANNOTATION_ADD_COMMAND, undefined)
    }
  }, [activeEditor, toolbarState])

  return (
    <>
      <div className="toolbar">
        {toolbarState.blockType in blockTypeToBlockName &&
          activeEditor === editor && (
            <>
              <BlockFormatDropDown
                disabled={!isEditable}
                blockType={toolbarState.blockType}
                editor={activeEditor}
                enableH4={enableH4}
              />
              <Divider />
            </>
          )}
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
          }}
          className={`toolbar-item spaced ${toolbarState.isBold ? 'active' : ''}`}
          title={`Bold (${SHORTCUTS.BOLD})`}
          type="button"
          aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}
        >
          <i className="format bold" />
        </button>
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
          }}
          className={`toolbar-item spaced ${toolbarState.isItalic ? 'active' : ''}`}
          title={`Italic (${SHORTCUTS.ITALIC})`}
          type="button"
          aria-label={`Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`}
        >
          <i className="format italic" />
        </button>
        <button
          disabled={!isEditable}
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
          }}
          className={`toolbar-item spaced ${toolbarState.isUnderline ? 'active' : ''}`}
          title={`Underline (${SHORTCUTS.UNDERLINE})`}
          type="button"
          aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`}
        >
          <i className="format underline" />
        </button>
        <button
          disabled={!isEditable}
          onClick={insertLink}
          className={`toolbar-item spaced ${toolbarState.isLink ? 'active' : ''}`}
          aria-label="Insert link"
          title={`Insert link (${SHORTCUTS.INSERT_LINK})`}
          type="button"
        >
          <i className="format link" />
        </button>
        {config.components?.ColorPicker && (
          <>
            <config.components.ColorPicker
              disabled={!isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting text color"
              buttonIconClassName="icon font-color"
              color={toolbarState.fontColor}
              onChange={onFontColorSelect}
              title="text color"
              type="text"
            />
            <config.components.ColorPicker
              disabled={!isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting background color"
              buttonIconClassName="icon bg-color"
              color={toolbarState.bgColor}
              onChange={onBgColorSelect}
              title="bg color"
              type="background"
            />
          </>
        )}
        <DropDown
          disabled={!isEditable}
          buttonClassName="toolbar-item spaced"
          buttonLabel=""
          buttonAriaLabel="Formatting options for additional text styles"
          buttonIconClassName="icon dropdown-more"
        >
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isLowercase)}`}
            title="Lowercase"
            aria-label="Format text to lowercase"
          >
            <div className="icon-text-container">
              <i className="icon lowercase" />
              <span className="text">Lowercase</span>
            </div>
            <span className="shortcut">{SHORTCUTS.LOWERCASE}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isUppercase)}`}
            title="Uppercase"
            aria-label="Format text to uppercase"
          >
            <div className="icon-text-container">
              <i className="icon uppercase" />
              <span className="text">Uppercase</span>
            </div>
            <span className="shortcut">{SHORTCUTS.UPPERCASE}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isCapitalize)}`}
            title="Capitalize"
            aria-label="Format text to capitalize"
          >
            <div className="icon-text-container">
              <i className="icon capitalize" />
              <span className="text">Capitalize</span>
            </div>
            <span className="shortcut">{SHORTCUTS.CAPITALIZE}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isStrikethrough)}`}
            title="Strikethrough"
            aria-label="Format text with a strikethrough"
          >
            <div className="icon-text-container">
              <i className="icon strikethrough" />
              <span className="text">Strikethrough</span>
            </div>
            <span className="shortcut">{SHORTCUTS.STRIKETHROUGH}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isSubscript)}`}
            title="Subscript"
            aria-label="Format text with a subscript"
          >
            <div className="icon-text-container">
              <i className="icon subscript" />
              <span className="text">Subscript</span>
            </div>
            <span className="shortcut">{SHORTCUTS.SUBSCRIPT}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
            }}
            className={`item wide ${dropDownActiveClass(toolbarState.isSuperscript)}`}
            title="Superscript"
            aria-label="Format text with a superscript"
          >
            <div className="icon-text-container">
              <i className="icon superscript" />
              <span className="text">Superscript</span>
            </div>
            <span className="shortcut">{SHORTCUTS.SUPERSCRIPT}</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => clearFormatting(activeEditor)}
            className="item wide"
            title="Clear text formatting"
            aria-label="Clear all text formatting"
          >
            <div className="icon-text-container">
              <i className="icon clear" />
              <span className="text">Clear Formatting</span>
            </div>
            <span className="shortcut">{SHORTCUTS.CLEAR_FORMATTING}</span>
          </DropDownItem>
        </DropDown>
        {enableAnnotation && (
          <button
            disabled={!isEditable}
            onClick={toggleAnnotation}
            className={`toolbar-item spaced ${toolbarState.isAnnotated ? 'active' : ''}`}
            aria-label="Add annotation"
            title={`Add annotation (${SHORTCUTS.ANNOTATION})`}
            type="button"
          >
            <i className="format annotation" />
          </button>
        )}
        {showInsertDropdown && (
          <>
            <Divider />
            <DropDown
              disabled={!isEditable}
              buttonClassName="toolbar-item spaced"
              buttonLabel=""
              buttonAriaLabel="insert some cool components"
              buttonIconClassName="icon plus"
            >
              {enableQuote && (
                <DropDownItem
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      WWW_QUOTE_ADD_COMMAND,
                      undefined
                    )
                  }}
                  className={`item wide`}
                  title="Quote"
                  aria-label="add quote"
                >
                  <div className="icon-text-container">
                    <i className="icon quote" />
                    <span className="text">Quote</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.QUOTE}</span>
                </DropDownItem>
              )}
              {enableInfobox && (
                <DropDownItem
                  onClick={() => {
                    activeEditor.dispatchCommand(INFOBOX_ADD_COMMAND, undefined)
                  }}
                  className={`item wide`}
                  title="Infobox"
                  aria-label="add infobox"
                >
                  <div className="icon-text-container">
                    <i className="icon infobox" />
                    <span className="text">Infobox</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.INFOBOX}</span>
                </DropDownItem>
              )}
              {enableEmbeddedCode && (
                <DropDownItem
                  onClick={() => {
                    setIsOpenEmbeddedCodeDialog(true)
                  }}
                  className={`item wide`}
                  title="Embedded Code"
                  aria-label="add embedded code"
                >
                  <div className="icon-text-container">
                    <i className="icon embedded" />
                    <span className="text">Embed</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.EMBEDDED_CODE}</span>
                </DropDownItem>
              )}
              {enableImageFromDb && (
                <DropDownItem
                  onClick={() => {
                    setIsOpenImageFromDbDialog(true)
                  }}
                  className={`item wide`}
                  title="Image from DB"
                  aria-label="add image from db"
                >
                  <div className="icon-text-container">
                    <i className="icon image-from-db" />
                    <span className="text">Image</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.IMAGE_FROM_DB}</span>
                </DropDownItem>
              )}
              {enableImage && (
                <DropDownItem
                  onClick={() => {
                    setIsOpenImageDialog(true)
                  }}
                  className={`item wide`}
                  title="Image Link"
                  aria-label="add image link"
                >
                  <div className="icon-text-container">
                    <i className="icon image-link" />
                    <span className="text">ImgLink</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.IMAGE_LINK}</span>
                </DropDownItem>
              )}
              {enableSlideShow && (
                <DropDownItem
                  onClick={() => {
                    setIsOpenSlideShowDialog(true)
                  }}
                  className={`item wide`}
                  title="SlideShow"
                  aria-label="add slide show"
                >
                  <div className="icon-text-container">
                    <i className="icon slide-show" />
                    <span className="text">Slideshow</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.SLIDE_SHOW}</span>
                </DropDownItem>
              )}
              {enableDivider && (
                <DropDownItem
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      INSERT_HORIZONTAL_RULE_COMMAND,
                      undefined
                    )
                  }}
                  className={`item wide`}
                  title="Divider"
                  aria-label="add divider"
                >
                  <div className="icon-text-container">
                    <i className="icon divider-button" />
                    <span className="text">Divider</span>
                  </div>
                  <span className="shortcut">{SHORTCUTS.DIVIDER}</span>
                </DropDownItem>
              )}
            </DropDown>
          </>
        )}
        <Divider />
        <Fullscreen
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
        <button
          disabled={!isFullscreen}
          onClick={togglePreview}
          className={`toolbar-item spaced`}
          type="button"
          aria-label={isEditable ? 'Preview rich editor' : 'Exit preview'}
        >
          <i className={`icon preview-${isEditable ? 'open' : 'close'}`} />
        </button>
        {modal}
      </div>
      {enableEmbeddedCode && isOpenEmbeddedCodeDialog && (
        <EmbeddedCodeEditDialog
          embeddedCode=""
          layout="default"
          caption=""
          showLoading={false}
          onClose={() => setIsOpenEmbeddedCodeDialog(false)}
          onConfirm={(embeddedCode, layout, caption, showLoading) =>
            activeEditor.dispatchCommand(EMBEDDED_CODE_ADD_COMMAND, {
              embeddedCode,
              layout,
              caption,
              showLoading,
            })
          }
        />
      )}
      {enableImage && isOpenImageDialog && (
        <ImageEditDialog
          imageLayout="default"
          imageUrl=""
          imageCaption=""
          onClose={() => setIsOpenImageDialog(false)}
          onConfirm={(url, layout, caption) =>
            activeEditor.dispatchCommand(IMAGE_ADD_COMMAND, {
              url,
              layout,
              caption,
            })
          }
        />
      )}
      {enableImage && isOpenImageFromDbDialog && imageConfig?.imageFromDb && (
        <ImageFromDbDialog
          imageFromDb={imageConfig.imageFromDb}
          onClose={() => setIsOpenImageFromDbDialog(false)}
          onConfirm={({ caption, url, layout, title }) =>
            activeEditor.dispatchCommand(IMAGE_ADD_COMMAND, {
              url,
              layout,
              caption,
              title,
              source: 'db',
            })
          }
        />
      )}
      {enableSlideShow && isOpenSlideShowDialog && imageConfig?.imageFromDb && (
        <SlideShowEditDialog
          imageFromDb={imageConfig.imageFromDb}
          onClose={() => setIsOpenSlideShowDialog(false)}
          onConfirm={(slides) =>
            activeEditor.dispatchCommand(SLIDE_SHOW_ADD_COMMAND, {
              slides,
            })
          }
        />
      )}
    </>
  )
}
