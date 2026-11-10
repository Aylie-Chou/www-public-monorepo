import type { ComponentType, PropsWithChildren } from 'react'
import type { EditorConfig } from '@twreporter/lexical-editor/core'
import { StyleWrapper } from './style'
import { PostContentStyleWrapper } from './style/post-content'
import { HeroEmbeddedStyleWrapper } from './style/hero-embedded'

type FieldEditorConfig = {
  ContentStyle: ComponentType<PropsWithChildren>
  mode: NonNullable<EditorConfig['mode']>
  features?: EditorConfig['features']
}

const defaultFieldConfig: FieldEditorConfig = {
  ContentStyle: StyleWrapper,
  mode: 'rich-text',
}

// Add field-specific styles and editor options here; the field view stays generic.
export const fieldConfigs = {
  'Author.bio': {
    ContentStyle: StyleWrapper,
    mode: 'rich-text',
    features: {
      image: false,
      embeddedCode: false,
      quote: false,
      infobox: false,
      slideShow: false,
      h4: false,
      annotation: false,
    },
  },
  'Post.brief': {
    ContentStyle: StyleWrapper,
    mode: 'rich-text',
    features: {
      image: false,
      embeddedCode: false,
      quote: false,
      infobox: false,
      slideShow: false,
      h4: false,
      annotation: true,
    },
  },
  'Post.content': {
    ContentStyle: PostContentStyleWrapper,
    mode: 'rich-text',
    features: {
      image: true,
      embeddedCode: true,
      quote: true,
      infobox: true,
      slideShow: true,
      h4: false,
      annotation: true,
    },
  },
  'PostFollowup.content': {
    ContentStyle: StyleWrapper,
    mode: 'rich-text',
    features: {
      image: true,
      embeddedCode: false,
      quote: true,
      infobox: false,
      slideShow: false,
      h4: false,
      annotation: true,
    },
  },
  'Topic.teamDescription': {
    ContentStyle: StyleWrapper,
    mode: 'rich-text',
    features: {
      image: true,
      embeddedCode: false,
      quote: false,
      infobox: false,
      slideShow: false,
      h4: false,
      annotation: true,
    },
  },
  'Topic.description': {
    ContentStyle: StyleWrapper,
    mode: 'rich-text',
    features: {
      image: true,
      embeddedCode: true,
      quote: false,
      infobox: true,
      slideShow: true,
      h4: false,
      annotation: true,
    },
  },
  'Post.heroEmbedded': {
    ContentStyle: HeroEmbeddedStyleWrapper,
    mode: 'embedded-code',
  },
} satisfies Record<string, FieldEditorConfig>

export function getFieldConfig(
  listKey: string,
  fieldKey: string
): FieldEditorConfig {
  const key = `${listKey}.${fieldKey}`
  return Object.hasOwn(fieldConfigs, key)
    ? fieldConfigs[key as keyof typeof fieldConfigs]
    : defaultFieldConfig
}
