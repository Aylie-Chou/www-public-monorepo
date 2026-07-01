import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import type { EditorTheme } from './theme'

export type EditorNodes = NonNullable<InitialConfigType['nodes']>

export type EditorUiConfig = {
  toolbar?: boolean
}

export type EditorPluginFlags = {
  history?: boolean
  richText?: boolean
}

export type EditorFeatureConfig = {
  annotation?: boolean
  divider?: boolean
  image?: boolean
  embeddedCode?: boolean
  quote?: boolean
  infobox?: boolean
  slideShow?: boolean
  h4?: boolean
}

export type ImageFromDbItem = {
  title: string
  url: string
}

export type ImageFromDbConfig = {
  pageSize?: number
  search: (params: {
    keyword: string
    page: number
    pageSize: number
    signal?: AbortSignal
  }) => Promise<{
    items: ImageFromDbItem[]
    total: number
  }>
  onError?: (error: Error) => void
}

export type ImageConfig = {
  relatedPhotosHref?: (imageTitle: string) => string
  imageFromDb?: ImageFromDbConfig
  getDbImageSrcSet?: (url: string) => string
}

export type UploadImageConfig = {
  /**
   * Async handler to upload a file and return the image URL and optional title
   */
  handler: (
    file: File,
    signal?: AbortSignal
  ) => Promise<{ url: string; title?: string }>

  /**
   * Optional validation function to check if a file is allowed
   * Return { valid: true } if file is valid, or { valid: false, error: string } if invalid
   */
  validate?: (file: File) => { valid: boolean; error?: string }

  /**
   * Maximum file size in bytes (default: 5MB)
   */
  maxFileSize?: number

  /**
   * Allowed MIME types (default: common image types)
   */
  allowedMimeTypes?: string[]

  /**
   * Optional error callback for handling upload errors
   */
  onError?: (error: Error) => void
}

export type EditorConfig = {
  theme: EditorTheme
  plugins?: EditorPluginFlags
  features?: EditorFeatureConfig
  ui?: EditorUiConfig
  image?: ImageConfig
  uploadImage?: UploadImageConfig
  readOnly?: boolean
  placeholder?: string
  namespace?: string
  nodes: EditorNodes
}

export type LexicalEditorValue = object

export type LexicalEditorProps = {
  config: EditorConfig
  value?: LexicalEditorValue
  autoFocus?: boolean
  onChange?: (value: string) => void
  onError?: InitialConfigType['onError']
}
