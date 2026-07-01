import type { ComponentType, PropsWithChildren, ReactNode } from 'react'

export type ToolbarButtonProps = {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  children?: ReactNode
  title?: string
}

export type FloatingPanelProps = PropsWithChildren<{
  className?: string
}>

export type ColorpickerProps = {
  disabled?: boolean
  buttonAriaLabel?: string
  buttonClassName: string
  buttonIconClassName?: string
  buttonLabel?: string
  title?: string
  stopCloseOnClickSelf?: boolean
  color: string
  onChange?: (color: string, skipHistoryStack: boolean) => void
  type?: 'text' | 'background'
}

export type EditorThemeClasses = {
  quote?: string
  heading?: {
    h1?: string
    h2?: string
    h3?: string
    h4?: string
    h5?: string
    h6?: string
  }
  hr?: string
  paragraph: string
  specialText?: string
  text?: {
    bold?: string
    capitalize?: string
    code?: string
    italic?: string
    lowercase?: string
    uppercase?: string
    strikethrough?: string
    subscript?: string
    superscript?: string
    underline?: string
    underlineStrikethrough?: string
  }
  list?: {
    ul?: string
    ol?: string
  }
  link?: string
  annotation?: string
  image?: string
  infobox?: string
  slideshow?: string
  wwwQuote?: string
}

export type EditorThemeTokens = {
  colorText?: string
  colorLinkHover?: string
  colorLinkBottom?: string
  colorDivider?: string
  colorInfoboxText?: string
  colorBgInfobox?: string
  colorInfoboxDressing?: string
  colorBgCanvas?: string
  colorBgToolbar?: string
}

export type EditorThemeComponents = {
  Toolbar?: ComponentType<PropsWithChildren>
  ToolbarButton?: ComponentType<ToolbarButtonProps>
  FloatingPanel?: ComponentType<FloatingPanelProps>
  ColorPicker?: ComponentType<ColorpickerProps>
}

export type EditorTheme = {
  classes: EditorThemeClasses
  tokens?: EditorThemeTokens
  components?: EditorThemeComponents
}

export const createEditorTheme = (theme: EditorTheme): EditorTheme => theme
