import styled from '@emotion/styled'

/**
 * Article content from Figma 569:44418, 570:46295, 604:7231, 617:7347.
 * The canvas is the viewport: Keystone's sidebar must not select a desktop
 * layout for a mobile-sized editor. Fullscreen establishes its own container.
 * Keep these overrides local to Post.content; other rich-text fields retain
 * their existing presentation and all nodes retain their serialized format.
 */
export const PostContentStyleWrapper = styled.div`
  .editor-shell {
    container: post-content / inline-size;
  }

  && {
    .editor {
      min-width: 0;
      font-family: 'Roboto Slab', 'Noto Sans TC', sans-serif;
    }

    .lexical-content-editable {
      --article-gutter: 24px;
      --article-inset: 0px;
      --article-column: 1 / -1;
      --article-wide-column: 1 / -1;
      --article-right-column: 1 / -1;
      --article-h2: 24px;
      --article-h3: 22px;
      --article-quote: 22px;
      --article-infobox-h2: 22px;
      --article-infobox-h3: 18px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 40px 24px;
      padding: 56px var(--article-gutter);
      color: var(--twreporter-lexical-color-text, #404040);
      font-size: 18px;
      line-height: 2.1;
      letter-spacing: 0.108px;
      overflow-wrap: anywhere;

      &, * {
        box-sizing: border-box;
      }

      > * {
        grid-column: var(--article-column);
        min-width: 0;
        margin: 0;
      }

      .TwreporterTheme__paragraph { margin: 0; white-space: pre-wrap; }
      .TwreporterTheme__textBold { font-weight: 700; }
      .TwreporterTheme__textItalic { font-style: italic; }
      .TwreporterTheme__textUnderline,
      .TwreporterTheme__textUnderlineStrikethrough {
        text-decoration: underline solid rgba(192, 150, 98, 0.5) 30%;
        text-underline-offset: -3px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }
      .TwreporterTheme__textStrikethrough { text-decoration: line-through; }
      .TwreporterTheme__textUnderlineStrikethrough { text-decoration-line: underline line-through; }
      .TwreporterTheme__textSubscript { font-size: 0.8em; vertical-align: sub; }
      .TwreporterTheme__textSuperscript { font-size: 0.8em; vertical-align: super; }
      .TwreporterTheme__textLowercase { text-transform: lowercase; }
      .TwreporterTheme__textUppercase { text-transform: uppercase; }
      .TwreporterTheme__textCapitalize { text-transform: capitalize; }

      .Annotation__content {
        padding: 12px;
        font-size: 16px;
        line-height: 2.1;
        letter-spacing: 0.096px;
        color: #666;
        .TwreporterTheme__paragraph { color: inherit; }
      }

      > .TwreporterTheme__paragraph,
      > .TwreporterTheme__h2,
      > .TwreporterTheme__h3 {
        padding-inline: var(--article-inset);
      }

      > .TwreporterTheme__h2,
      > .TwreporterTheme__h3 {
        padding-top: 20px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .TwreporterTheme__h2 { font-size: var(--article-h2); line-height: 1.25; }
      .TwreporterTheme__h3 { font-size: var(--article-h3); line-height: 1.5; }

      .TwreporterTheme__ul,
      .TwreporterTheme__ol {
        display: block;
        margin: 0;
        padding: 0 0 0 16px;
        font-size: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        li { margin: 0 0 0 27px; }
      }

      > .TwreporterTheme__ul,
      > .TwreporterTheme__ol {
        padding-inline: calc(var(--article-inset) + 16px) var(--article-inset);
      }

      .TwreporterTheme__wwwQuote {
        padding: 0;
        margin: 0;
        .TwreporterTheme__paragraph { color: inherit; }
      }

      .wwwQuote__container.default {
        padding-inline: calc(var(--article-inset) + 18px) var(--article-inset);
        .wwwQuote__content {
          color: #808080;
          font-size: 18px;
          line-height: 2.1;
          letter-spacing: 0.108px;
        }
        .wwwQuote__quote_by {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: 0;
        }
      }

      .wwwQuote__container.blockquote {
        padding-block: 20px;
        .wwwQuote__content {
          font-size: var(--article-quote);
          line-height: 1.5;
          letter-spacing: 0;
        }
        .wwwQuote__quote_by {
          margin-top: 20px;
          padding-inline: var(--article-inset);
          font-size: 16px;
          line-height: 1.5;
          letter-spacing: 0;
        }
      }

      .TwreporterTheme__infobox {
        margin-block: 20px;
        padding: 40px 24px;
        gap: 20px;
        font-size: 16px;
        line-height: 2.1;
        letter-spacing: 0.096px;
        .Annotation__content {
          border-right: 1px solid #f1f1f1;
          border-left: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
        }
        .TwreporterTheme__h2,
        .TwreporterTheme__h3 { padding: 0; margin: 0; color: #666; line-height: 1.5; }
        .TwreporterTheme__h2 { font-size: var(--article-infobox-h2); }
        .TwreporterTheme__h3 { font-size: var(--article-infobox-h3); }
        .TwreporterTheme__ul,
        .TwreporterTheme__ol {
          padding-left: 18px;
          li { margin-left: 24px; }
        }
      }

      .TwreporterTheme__image {
        grid-column: var(--article-wide-column);
        display: block;
        padding-block: 20px;
        float: none;

        figure {
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0 24px;
          align-items: end;
        }
        .Image__image {
          grid-column: 1 / -1;
          width: calc(100% + 2 * var(--article-gutter));
          max-width: none;
          height: auto;
          transform: translateX(calc(-1 * var(--article-gutter)));
        }
        .Image__caption {
          grid-column: 2 / -1;
          margin: 0;
          padding: 16px 0;
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: 0;
          color: #808080;
        }
        &.right {
          grid-column: var(--article-right-column);
          .Image__image { width: 100%; transform: none; }
        }
      }

      .TwreporterTheme__slideshow {
        grid-column: var(--article-wide-column);
        padding-block: 20px;
        .SlideShow__container {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0 24px;
          padding: 0;
        }
        .SlideShow__media {
          grid-column: 1 / -1;
          width: calc(100% + 2 * var(--article-gutter));
          margin-left: calc(-1 * var(--article-gutter));
        }
        .SlideShow__body {
          grid-column: 1 / -1;
          gap: 20px;
          padding-top: 20px;
        }
        .SlideShow__controls { margin: 0; }
      }

      .EmbeddedCode__content.fullscreen {
        grid-column: 1 / -1;
        width: calc(100% + 2 * var(--article-gutter));
        margin-inline: calc(-1 * var(--article-gutter));
      }
    }

    @container post-content (min-width: 768px) {
      .lexical-content-editable {
        --article-gutter: 32px;
        --article-inset: 32px;
        --article-column: 2 / 12;
        --article-right-column: 2 / 12;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        .TwreporterTheme__infobox { padding-inline: 32px; }
        .TwreporterTheme__image {
          figure { grid-template-columns: repeat(12, minmax(0, 1fr)); }
          .Image__caption { grid-column: 4 / -1; }
          &.right .Image__caption { grid-column: 1 / -1; }
        }
        .TwreporterTheme__slideshow {
          .SlideShow__container { grid-template-columns: repeat(12, minmax(0, 1fr)); }
          .SlideShow__body { grid-column: 5 / -1; }
        }
      }
    }

    @container post-content (min-width: 1024px) {
      .lexical-content-editable {
        --article-gutter: 48px;
        --article-column: 4 / 10;
        --article-wide-column: 4 / -1;
        --article-right-column: 8 / -1;
        --article-h2: 32px;
        --article-h3: 28px;
        --article-quote: 28px;
        --article-infobox-h2: 28px;
        --article-infobox-h3: 22px;
        column-gap: 32px;
        padding-bottom: 96px;
        .TwreporterTheme__image {
          figure { grid-template-columns: repeat(9, minmax(0, 1fr)); column-gap: 32px; }
          .Image__image { width: 100%; transform: none; }
          .Image__caption { grid-column: 7 / -1; }
          &.small {
            .Image__image { grid-column: 1 / 7; grid-row: 1; }
            .Image__caption { grid-row: 1; padding-top: 0; }
          }
          &.right {
            figure { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            .Image__caption { grid-column: 3 / -1; }
          }
        }
        .TwreporterTheme__slideshow {
          .SlideShow__container { grid-template-columns: repeat(9, minmax(0, 1fr)); column-gap: 32px; }
          .SlideShow__media { width: 100%; margin: 0; }
          .SlideShow__body { grid-column: 7 / -1; }
        }
      }
    }

    @container post-content (min-width: 1440px) {
      .lexical-content-editable { --article-gutter: 80px; }
    }
  }
`
