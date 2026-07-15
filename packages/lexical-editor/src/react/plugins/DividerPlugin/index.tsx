import {
  $createHorizontalRuleNode,
  HorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
} from '@lexical/extension'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  type LexicalNode,
} from 'lexical'
import { useEffect, type FC } from 'react'

import { $isInfoboxNode, type InfoboxNode } from '../InfoboxPlugin/nodes'

function $findAncestorInfoboxNode(node: LexicalNode): InfoboxNode | null {
  let currentNode: LexicalNode | null = node

  while (currentNode) {
    if ($isInfoboxNode(currentNode)) {
      return currentNode
    }

    currentNode = currentNode.getParent()
  }

  return null
}

function $findDirectInfoboxChild(
  node: LexicalNode,
  infoboxNode: InfoboxNode
): LexicalNode | null {
  let currentNode: LexicalNode | null = node
  let childNode: LexicalNode | null = null

  while (currentNode && currentNode !== infoboxNode) {
    childNode = currentNode
    currentNode = currentNode.getParent()
  }

  return currentNode === infoboxNode ? childNode : null
}

function $insertDividerNode(): boolean {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) {
    return false
  }

  const dividerNode = $createHorizontalRuleNode()
  const anchorNode = selection.anchor.getNode()
  const infoboxNode = $findAncestorInfoboxNode(anchorNode)

  if (!infoboxNode) {
    $insertNodes([dividerNode])
    return true
  }

  const childNode = $findDirectInfoboxChild(anchorNode, infoboxNode)

  if (!selection.isCollapsed()) {
    selection.removeText()
  }

  if (childNode) {
    childNode.insertAfter(dividerNode)
  } else {
    infoboxNode.append(dividerNode)
  }

  return true
}

const DividerPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([HorizontalRuleNode])) {
      throw new Error(
        'DividerPlugin: HorizontalRuleNode not registered on editor'
      )
    }

    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      () => $insertDividerNode(),
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}

export default DividerPlugin
