import { createEmotionEditorTheme } from '@twreporter/lexical-editor/theme-emotion'
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import {
  cmsEditorNodes,
  type EditorConfig,
  type EditorFeatureConfig,
} from '@twreporter/lexical-editor/core'
import { uploadImageHandler } from './uploadImageHandler'
import { getDbImageSrcSet, searchPhotoHandler } from './searchPhotoHandler'

type CreateCmsEditorConfigOptions = {
  features?: EditorFeatureConfig
  mode?: EditorConfig['mode']
}

const createCmsEditorConfig = ({
  features,
  mode = 'rich-text',
}: CreateCmsEditorConfigOptions = {}): EditorConfig => ({
  theme: createCmsEditorTheme(),
  nodes: cmsEditorNodes,
  mode,
  ...(features ? { features } : {}),
  ui: { toolbar: true },
  image: {
    relatedPhotosHref: (imageTitle: string) =>
      `/photos?!name_is_i=${encodeURIComponent(`"${imageTitle}"`)}`,
    imageFromDb: {
      search: searchPhotoHandler,
      pageSize: 6,
      onError: (error: Error) => {
        console.error('Photo search failed:', error)
      },
    },
    getDbImageSrcSet,
  },
  uploadImage: {
    handler: uploadImageHandler,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    onError: (error: Error) => {
      console.error('Image upload failed:', error)
      alert('照片上傳失敗，請再試一次，若持續失敗請回報產品經理')
    },
  },
})

export default createCmsEditorConfig

const createCmsEditorTheme = () => {
  const theme = createEmotionEditorTheme()

  return {
    ...theme,
    tokens: {
      ...theme.tokens,
      colorBgCanvas: colorGrayscale.gray100,
      colorBgToolbar: colorGrayscale.white,
      colorText: colorGrayscale.gray800,
      colorLinkHover: colorSupportive.heavy,
      colorLinkBottom: 'rgba(102, 102, 102, 0.50)',
    },
  }
}
