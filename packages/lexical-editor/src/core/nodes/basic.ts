// type
import type { Klass, LexicalNode } from 'lexical'
// official nodes
import { OverflowNode } from '@lexical/overflow'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HorizontalRuleNode } from '@lexical/extension'
// custom nodes
import {
  AnnotatedTextNode,
  AnnotationContentNode,
  AnnotationNode,
} from '../../react/plugins/AnnotationPlugin/nodes'
import { EmbeddedCodeNode } from '../../react/plugins/EmbeddedCodePlugin/nodes'
import { ImageNode } from '../../react/plugins/ImagePlugin/nodes'
import { InfoboxNode } from '../../react/plugins/InfoboxPlugin/nodes'
import {
  WwwQuoteByNode,
  WwwQuoteContentNode,
  WwwQuoteNode,
} from '../../react/plugins/QuotePlugin/nodes'
import { SlideShowNode } from '../../react/plugins/SlideShowPlugin/nodes'

export const basicEditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  OverflowNode,
  AutoLinkNode,
  LinkNode,
  ListItemNode,
  ListNode,
  HorizontalRuleNode,
  AnnotationNode,
  AnnotatedTextNode,
  AnnotationContentNode,
  EmbeddedCodeNode,
  ImageNode,
  InfoboxNode,
  SlideShowNode,
  WwwQuoteNode,
  WwwQuoteContentNode,
  WwwQuoteByNode,
]
