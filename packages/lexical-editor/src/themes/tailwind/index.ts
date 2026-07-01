import type { EditorTheme } from '../../core/types/theme'

export const createTailwindEditorTheme = (): EditorTheme => {
  return {
    classes: {
      paragraph: 'mb-2 leading-7',
      heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-semibold mb-2',
        h4: 'text-lg font-semibold mb-2',
      },
      hr: 'w-full h-px border-0 bg-gray-300',
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        code: 'font-mono text-sm bg-gray-100 px-1 py-0.5 rounded',
      },
      list: {
        ul: 'list-disc pl-6',
        ol: 'list-decimal pl-6',
      },
      link: 'text-blue-600 underline',
    },
  }
}

export const tailwindEditorTheme = createTailwindEditorTheme()
