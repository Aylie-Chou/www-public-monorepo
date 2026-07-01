# @twreporter/lexical-editor

Reusable Lexical editor package for the monorepo.

## Background

This package extracts the Lexical editor implementation from the Keystone 6 CMS project into a shared monorepo package.

Current goals:

- share editor logic between `cms` and `frontend`
- keep editor core independent from any single styling solution
- support multiple theme implementations
- make future editor-related features easier to maintain

## Scope

This package is intended to provide:

- editor core logic
- Lexical nodes / commands / serialization helpers
- React integration layer
- theme adapters for different consumers

This package is **not** intended to own:

- CMS global design system
- Keystone-specific page layout
- frontend app-specific business logic

## Proposed Structure

```txt
src/
  core/
  react/
  themes/
    emotion/
    tailwind/
```

### Layer Responsibilities

`core/`
Contains editor domain logic that should not be tied to a styling system.

Examples:
- nodes
- commands
- transforms
- serialization
- theme type definitions

`react/`
Contains React / Lexical React integration.

Examples:
- editor shell
- plugins
- hooks
- context
- React composition logic

`themes/`
Contains theme implementations for different consumers.

Examples:
- themes/emotion for CMS
- themes/tailwind for frontend

## Installation

This package is intended to be consumed from the monorepo workspace.

Example:
```bash
yarn workspace cms add @twreporter/lexical-editor
```
or via workspace dependency in package.json.

## Usage

To use the `LexicalEditor` component, you should import component itself, theme config, and css file.

```ts
// import component
import { LexicalEditor } from '@twreporter/lexical-editor'
// import css
import '@twreporter/lexical-editor/style'
// import theme config (use emotion version for example)
import { createEmotionEditorTheme } from '@twreporter/lexical-editor/theme-emotion'
import { cmsEditorNodes, type EditorConfig } from '@twreporter/lexical-editor/core'

const createCmsEditorConfig = (): EditorConfig => ({
  theme: createEmotionEditorTheme(),
  nodes: cmsEditorNodes,
  ui: { toolbar: true }
})

// use component
const config = createLexicalEditorConfig()
<LexicalEditor value={valueJSON} onChange={onChange} config={config} />
```

### Theme Tokens

Theme tokens are exposed as CSS custom properties on the `.lexical-editor` root so editor CSS and plugin node CSS can share the same theme values. Set token values to CSS values, such as `#ffffff` or `rgb(250, 251, 252)`.

`theme.tokens.colorBgCanvas` controls the editable editor canvas background.
`theme.tokens.colorDivider` controls divider color.

### Feature Flags

Editor features are enabled by default unless a feature flag is set to `false`.

```ts
const config: EditorConfig = {
  theme: createEmotionEditorTheme(),
  nodes: cmsEditorNodes,
  ui: { toolbar: true },
  features: {
    annotation: false,
    divider: false,
    h4: false
  }
}
```

## Build

```bash
yarn workspace @twreporter/lexical-editor build
```

## Dev

```bash
yarn workspace @twreporter/lexical-editor dev
```

## Design Principles

- editor core should not depend on Emotion or Tailwind
- React integration should not hard-code a single theme implementation
- consumer-specific composition should stay outside core
- theme layer should be replaceable

## Notes

- This package currently targets React-based consumers only.
- Styling strategy is adapter-based rather than package-wide lock-in.
- CMS-specific or frontend-specific business behavior should be injected from the consumer when possible.
