import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import test from 'node:test'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const coreEntry = require.resolve('@keystone-6/core')
const { gql, InMemoryCache } = createRequire(coreEntry)('@apollo/client')
// Exercise the actual factory installed by the Yarn patch.
const { createAdminMetaCache } = await import(
  pathToFileURL(path.join(path.dirname(coreEntry), 'admin-meta-cache.js')).href
)
const overview = gql`
  query Overview {
    keystone { adminMeta { lists { key label } } }
  }
`
const item = gql`
  query Item($id: ID!) {
    keystone {
      adminMeta {
        list(key: "Post", itemId: $id) {
          fields { key itemView { fieldMode fieldPosition isRequired } }
        }
      }
    }
  }
`
/** @param {Record<string, unknown>} adminMeta */
const wrap = (adminMeta) => ({
  keystone: {
    __typename: 'KeystoneMeta',
    adminMeta: { __typename: 'KeystoneAdminMeta', ...adminMeta },
  },
})
const overviewData = wrap({
  lists: [
    { __typename: 'KeystoneAdminUIListMeta', key: 'Post', label: 'Posts' },
  ],
})
/** @param {string} fieldMode */
const itemData = (fieldMode) =>
  wrap({
    list: {
      __typename: 'KeystoneAdminUIListMeta',
      fields: [
        {
          __typename: 'KeystoneAdminUIFieldMeta',
          key: 'id',
          itemView: {
            __typename: 'KeystoneAdminUIFieldMetaItemView',
            fieldMode,
            fieldPosition: 'sidebar',
            isRequired: false,
          },
        },
      ],
    },
  })

/** @param {import('@keystone-6/core/admin-ui/apollo').InMemoryCache} cache */
function writeOverview(cache) {
  cache.writeQuery({ query: overview, data: overviewData })
}
/**
 * @param {import('@keystone-6/core/admin-ui/apollo').InMemoryCache} cache
 * @param {string} id
 * @param {string} mode
 */
function writeItem(cache, id, mode) {
  cache.writeQuery({ query: item, variables: { id }, data: itemData(mode) })
}

test('reproduces lost overview metadata with the unpatched cache', () => {
  const cache = new InMemoryCache()
  writeOverview(cache)
  writeItem(cache, '1', 'edit')
  assert.equal(cache.readQuery({ query: overview }), null)
})

for (const order of ['overview-first', 'item-first']) {
  test(`retains overview and item metadata (${order})`, () => {
    const cache = createAdminMetaCache()
    if (order === 'overview-first') writeOverview(cache)
    writeItem(cache, '1', 'edit')
    writeOverview(cache)
    assert.deepEqual(cache.readQuery({ query: overview }), overviewData)
    assert.deepEqual(
      cache.readQuery({ query: item, variables: { id: '1' } }),
      itemData('edit')
    )
    writeItem(cache, '1', 'read')
    assert.deepEqual(cache.readQuery({ query: overview }), overviewData)
    assert.deepEqual(
      cache.readQuery({ query: item, variables: { id: '1' } }),
      itemData('read')
    )
  })
}

test('keeps permissions separate for different items and accepts permission refreshes', () => {
  const cache = createAdminMetaCache()
  writeOverview(cache)
  writeItem(cache, '1', 'edit')
  writeItem(cache, '2', 'read')
  writeItem(cache, '1', 'hidden')
  assert.deepEqual(
    cache.readQuery({ query: item, variables: { id: '1' } }),
    itemData('hidden')
  )
  assert.deepEqual(
    cache.readQuery({ query: item, variables: { id: '2' } }),
    itemData('read')
  )
  assert.deepEqual(cache.readQuery({ query: overview }), overviewData)
})

test('resetting the cache clears all metadata', () => {
  const cache = createAdminMetaCache()
  writeOverview(cache)
  writeItem(cache, '1', 'edit')
  cache.restore({})
  assert.equal(cache.readQuery({ query: overview }), null)
  assert.equal(cache.readQuery({ query: item, variables: { id: '1' } }), null)
})
