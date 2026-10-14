import { readFile, readdir } from 'node:fs/promises'
import { findPackageJSON } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// Resolve the package export so this works with both workspace and npm installs.
export async function getEditorStyleFiles() {
  const manifestPath = findPackageJSON(
    '@twreporter/lexical-editor',
    pathToFileURL(path.resolve('package.json'))
  )
  if (!manifestPath) throw new Error('Cannot find the Lexical editor package')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const stylesheet = path.resolve(
    path.dirname(manifestPath),
    manifest.exports['./style'].import
  )
  const assetsDirectory = path.join(path.dirname(stylesheet), 'assets')
  const assets = await readdir(assetsDirectory)

  return [
    {
      mode: 'copy' as const,
      inputPath: path.resolve('admin/document.jsx'),
      outputPath: 'pages/_document.js',
    },
    {
      mode: 'copy' as const,
      inputPath: stylesheet,
      outputPath: 'public/lexical-editor/style.css',
    },
    ...assets.map((asset) => ({
      mode: 'copy' as const,
      inputPath: path.join(assetsDirectory, asset),
      outputPath: `public/lexical-editor/assets/${asset}`,
    })),
  ]
}
