import styled from '@emotion/styled'

export const HeroEmbeddedStyleWrapper = styled.div`
  .embedded-code-editor__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;

    label, textarea {
      width: 100%;
    }

    textarea {
      box-sizing: border-box;
      resize: vertical;
      font-family: monospace;
    }
  }

  .embedded-code-editor__preview {
    overflow: auto;
    max-width: 100%;
  }

  .EmbeddedCode__html {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
