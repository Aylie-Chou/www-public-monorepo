import { createWriteStream } from 'node:fs'
import { mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type {
  BaseKeystoneTypeInfo,
  StorageStrategy,
} from '@keystone-6/core/types'
import envVars from './environment-variables'

export const imageStorage: StorageStrategy<BaseKeystoneTypeInfo> = {
  async put(key, stream) {
    await mkdir(envVars.images.storagePath, { recursive: true })
    await pipeline(
      stream,
      createWriteStream(path.join(envVars.images.storagePath, key))
    )
  },
  async delete(key) {
    await unlink(path.join(envVars.images.storagePath, key)).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error
      }
    )
  },
  url: (key) => `/images/${key}`,
}
