import { useMemo, useRef, type CSSProperties, type JSX } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import type { EditorState } from 'lexical'
// context
import { ImageConfigContext } from '../context/ImageConfigContext'
import { ToolbarContext } from '../context/ToolbarContext'
// plugin
import { OnChangePlugin } from '../plugins/OnChangePlugin'
// utils
import buildImportMap from '../utils/buildImportMap'
// components
import RichEditor from './RichEditor'
// types
import type { EditorThemeTokens, LexicalEditorProps } from '../../core'

import '../style/Editor.scss'
import '../style/icon.scss'

const defaultOnError = (error: Error) => {
  throw error
}

type EditorThemeStyle = CSSProperties & Record<`--${string}`, string>

const themeTokenCssVariables: Record<keyof EditorThemeTokens, `--${string}`> = {
  colorText: '--twreporter-lexical-color-text',
  colorLinkHover: '--twreporter-lexical-color-link-hover',
  colorLinkBottom: '--twreporter-lexical-color-link-bottom',
  colorDivider: '--twreporter-lexical-color-divider',
  colorInfoboxText: '--twreporter-lexical-color-infobox-text',
  colorInfoboxDressing: '--twreporter-lexical-color-infobox-dressing',
  colorBgInfobox: '--twreporter-lexical-color-bg-infobox',
  colorBgCanvas: '--twreporter-lexical-color-bg-canvas',
  colorBgToolbar: '--twreporter-lexical-color-bg-toolbar',
}

const createThemeTokenStyle = (
  tokens?: EditorThemeTokens
): EditorThemeStyle | undefined => {
  if (!tokens) {
    return undefined
  }

  const style = {} as EditorThemeStyle
  let hasToken = false

  for (const tokenName of Object.keys(
    themeTokenCssVariables
  ) as (keyof EditorThemeTokens)[]) {
    const tokenValue = tokens[tokenName]

    if (tokenValue) {
      style[themeTokenCssVariables[tokenName]] = tokenValue
      hasToken = true
    }
  }

  return hasToken ? style : undefined
}

export const LexicalEditor = ({
  config,
  value,
  onChange,
  onError = defaultOnError,
}: LexicalEditorProps): JSX.Element => {
  const initialValue = useRef(value)

  const initialEditorState = useMemo(
    () =>
      initialValue.current ? JSON.stringify(initialValue.current) : undefined,
    []
  )

  const placeholder = config?.placeholder ?? 'Enter some rich text...'

  const initialConfig = {
    namespace: config.namespace ?? 'LexicalEditor',
    html: { import: buildImportMap() },
    theme: config.theme.classes,
    editable: !config.readOnly,
    onError,
    nodes: config.nodes,
    ...(initialEditorState ? { editorState: initialEditorState } : {}),
  }

  const onEditorStateChange = (editorState: EditorState) => {
    onChange?.(JSON.stringify(editorState.toJSON()))
  }

  const themeTokenStyle = useMemo(
    () => createThemeTokenStyle(config.theme.tokens),
    [config.theme.tokens]
  )

  return (
    <div className="lexical-editor" style={themeTokenStyle}>
      <LexicalComposer initialConfig={initialConfig}>
        <ImageConfigContext value={config.image}>
          <ToolbarContext>
            <RichEditor config={config} placeholder={placeholder} />
          </ToolbarContext>
        </ImageConfigContext>
        <OnChangePlugin onChange={onEditorStateChange} />
      </LexicalComposer>
    </div>
  )
}

export default LexicalEditor
