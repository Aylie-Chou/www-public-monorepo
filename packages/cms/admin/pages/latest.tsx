import styled from '@emotion/styled'
import { gql, useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Button } from '../components/controls'
import { Heading } from '../components/controls'
import {
  FieldDescription,
  FieldLabel,
  MultiSelect,
} from '../components/controls'
import { AlertDialog } from '../components/controls'
import { useToasts } from '../components/controls'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { DnD } from '../../DragAndDrop'

const queries = {
  GET_TAGS: gql`
    query ($where: TagWhereInput, $orderBy: [TagOrderByInput!]) {
      tags(where: $where, orderBy: $orderBy) {
        id
        value: id
        slug
        label: name
        latestPost: posts(orderBy: { publishedDate: desc }, take: 1) {
          publishedDate
        }
        postsCount
      }
    }
  `,
  GET_LATEST: gql`
    query ($where: LatestWhereInput, $orderBy: [LatestOrderByInput!]) {
      latests(where: $where, orderBy: $orderBy) {
        id
        tag {
          id
          value: id
          slug
          label: name
          latestPost: posts(orderBy: { publishedDate: desc }, take: 1) {
            publishedDate
          }
          postsCount
        }
      }
    }
  `,
}

const mutations = {
  DELETE_ALL_LATEST_AND_BULK_CREATE: gql`
    mutation DeleteAllLatestAndBulkCreate(
      $deleteCondition: [LatestWhereUniqueInput!]!
      $createData: [LatestCreateInput!]!
    ) {
      deleteAllLatestAndBulkCreate(
        deleteCondition: $deleteCondition
        createData: $createData
      ) {
        id
        order
        tag {
          id
          name
        }
      }
    }
  `,
}

const StyledContainer = styled.div`
  margin-top: 24px;
  width: 75%;
`

const Toolbar = styled.div`
  margin-top: 24px;
  width: 75%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

const SortItem = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  .label,
  .slug,
  .post-count,
  .latest-post-date {
    flex: 25%;
  }
`

const InfoColumn = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  border-radius: 5px;
  padding: 5px 15px;
  color: rgb(140, 150, 160);
  background-color: rgb(248, 248, 248);
  margin-bottom: 5px;
  .label,
  .slug,
  .post-count,
  .latest-post-date {
    flex: 25%;
  }
`

type Tag = {
  id: string
  value: string
  slug: string
  label: string
  latestPost: { publishedDate: string }[]
  postsCount: number
}

type Latest = {
  id: string
  tag: Tag
}

type SelectOption = {
  id: string
  value: string
  label: string
  itemJSX: ReactNode
}

const Latest = () => {
  // Queries
  const {
    data: tagsData,
    loading: tagsDataLoading,
    error: tagsDataError,
    refetch: refetchTags,
  } = useQuery<{ tags: Tag[] }>(queries.GET_TAGS, {
    variables: { where: { OR: [] }, orderBy: [{ createdAt: 'desc' }] },
  })

  const {
    data: latestData,
    loading: latestDataLoading,
    error: latestDataError,
  } = useQuery<{ latests: Latest[] }>(queries.GET_LATEST, {
    variables: { where: { OR: [] }, orderBy: [{ order: 'asc' }] },
  })

  // Mutations
  const [
    deleteAllAndCreate,
    { loading: deleteAllAndCreateLoading, error: deleteAllAndCreateError },
  ] = useMutation(mutations.DELETE_ALL_LATEST_AND_BULK_CREATE, {
    refetchQueries: [queries.GET_LATEST],
  })

  const getLatestPostDate = useCallback(
    (posts: { publishedDate: string }[]) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        return ''
      }

      const firstPost = posts[0]
      return firstPost?.publishedDate
        ? new Date(firstPost.publishedDate).toLocaleDateString()
        : ''
    },
    []
  )

  const transformedTagsOptions: SelectOption[] = useMemo(
    () =>
      tagsData?.tags?.map((tag: Tag) => {
        const { id, value, slug, label, postsCount, latestPost } = tag
        const latestPostDate = getLatestPostDate(latestPost)
        return {
          id,
          value,
          label,
          itemJSX: (
            <SortItem>
              <div className="label">{label}</div>
              <div className="slug">{slug}</div>
              <div className="post-count">{postsCount}</div>
              <div className="latest-post-date">{latestPostDate}</div>
            </SortItem>
          ),
        }
      }) || [],
    [tagsData, getLatestPostDate]
  )

  const initialSelectedOptions: SelectOption[] = useMemo(
    () =>
      latestData?.latests?.map((latest: Latest) => {
        const { id, tag } = latest
        const { value, slug, label, postsCount, latestPost } = tag
        const latestPostDate = getLatestPostDate(latestPost)
        return {
          id,
          value,
          label,
          itemJSX: (
            <SortItem>
              <div className="label">{label}</div>
              <div className="slug">{slug}</div>
              <div className="post-count">{postsCount}</div>
              <div className="latest-post-date">{latestPostDate}</div>
            </SortItem>
          ),
        }
      }) || [],
    [latestData, getLatestPostDate]
  )

  const [selectedOption, setSelectedOption] = useState<SelectOption[]>(
    initialSelectedOptions
  )
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)

  const toasts = useToasts()

  const isDirty = useMemo(
    () =>
      selectedOption.length !== initialSelectedOptions.length ||
      selectedOption.some(
        (option, index) => option.id !== initialSelectedOptions[index]?.id
      ),
    [selectedOption, initialSelectedOptions]
  )

  const handleSave = async () => {
    await deleteAllAndCreate({
      variables: {
        deleteCondition: initialSelectedOptions.map(({ id }) => ({ id })),
        createData: selectedOption.map(({ value }, index) => ({
          tag: { connect: { id: value } },
          order: index + 1,
        })),
      },
    })

    if (deleteAllAndCreateError) {
      toasts.addToast({
        title: 'Failed to update latest',
        tone: 'negative',
        message: `${deleteAllAndCreateError}`,
      })
      return
    }
    toasts.addToast({
      tone: 'positive',
      title: 'Saved successfully',
    })
  }

  const handleReset = () => {
    setSelectedOption(initialSelectedOptions)
    setConfirmModalOpen(false)
  }

  useEffect(() => {
    setSelectedOption(initialSelectedOptions)
    refetchTags()
  }, [initialSelectedOptions, refetchTags])

  if (tagsDataError || latestDataError) {
    return (
      <PageContainer header={<Heading type="h3">Latest</Heading>}>
        {`Error: ${tagsDataError || latestDataError}`}
      </PageContainer>
    )
  }

  if (tagsDataLoading || latestDataLoading) {
    return (
      <PageContainer header={<Heading type="h3">Latest</Heading>}>
        Loading...
      </PageContainer>
    )
  }

  return (
    <PageContainer header={<Heading type="h3">Latest</Heading>}>
      <StyledContainer>
        <FieldLabel>最新頁分頁</FieldLabel>
        <FieldDescription id="description">
          利用標籤設定更即時性的主題文章精選
        </FieldDescription>
      </StyledContainer>

      <StyledContainer>
        <FieldLabel>標籤</FieldLabel>
        <MultiSelect
          value={selectedOption}
          options={transformedTagsOptions}
          onChange={setSelectedOption}
        />
      </StyledContainer>

      {selectedOption.length > 0 && (
        <StyledContainer>
          <FieldLabel>排序</FieldLabel>
          <FieldDescription id="description">拖曳來排序</FieldDescription>
          <InfoColumn>
            <div className="label">標題名稱</div>
            <div className="slug">Slug</div>
            <div className="post-count">文章數量</div>
            <div className="latest-post-date">最新文章日期</div>
          </InfoColumn>
          <DnD
            items={selectedOption}
            setItems={setSelectedOption}
            emptyPlachholder={'請選擇標籤'}
          />
        </StyledContainer>
      )}

      <Toolbar>
        <Button
          weight="bold"
          tone="active"
          isDisabled={!isDirty}
          isLoading={deleteAllAndCreateLoading}
          onClick={handleSave}
        >
          Save changes
        </Button>
        <Button
          weight="none"
          isDisabled={!isDirty}
          isLoading={deleteAllAndCreateLoading}
          onClick={() => setConfirmModalOpen(true)}
        >
          Reset changes
        </Button>
      </Toolbar>
      <AlertDialog
        actions={{
          confirm: {
            action: () => handleReset(),
            label: 'Reset changes',
          },
          cancel: {
            action: () => setConfirmModalOpen(false),
            label: 'Cancel',
          },
        }}
        isOpen={isConfirmModalOpen}
        title="Are you sure you want to reset changes?"
        tone="negative"
      >
        {null}
      </AlertDialog>
    </PageContainer>
  )
}

export default Latest
