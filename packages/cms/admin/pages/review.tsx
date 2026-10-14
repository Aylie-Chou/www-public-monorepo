import styled from '@emotion/styled'
import { gql, useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Link } from '@keystone-6/core/admin-ui/router'
import { Button } from '../components/controls'
import { Heading } from '../components/controls'
import {
  FieldDescription,
  FieldLabel,
  MultiSelect,
} from '../components/controls'
import { AlertDialog } from '../components/controls'
import { useToasts } from '../components/controls'
import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { DnD } from '../../DragAndDrop'

const queries = {
  GET_POSTS: gql`
    query ($where: PostWhereInput, $orderBy: [PostOrderByInput!]) {
      posts(where: $where, orderBy: $orderBy) {
        id
        value: id
        title
        reviewWord
        publishedDate
      }
    }
  `,
  GET_REVIEWS: gql`
    query ($where: ReviewWhereInput, $orderBy: [ReviewOrderByInput!]) {
      reviews(where: $where, orderBy: $orderBy) {
        id
        post {
          id
          value: id
          title
          reviewWord
          publishedDate
        }
      }
    }
  `,
}

const mutations = {
  DELETE_ALL_REVIEW_AND_BULK_CREATE: gql`
    mutation DeleteAllReviewsAndBulkCreate(
      $deleteCondition: [ReviewWhereUniqueInput!]!
      $createData: [ReviewCreateInput!]!
    ) {
      deleteAllReviewsAndBulkCreate(
        deleteCondition: $deleteCondition
        createData: $createData
      ) {
        id
        order
        post {
          id
          value: id
          title
          reviewWord
          publishedDate
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
  .title {
    flex: 60%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .review-word {
    flex: 25%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .published-date {
    flex: 15%;
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
  .title {
    flex: 60%;
  }
  .review-word {
    flex: 25%;
  }
  .published-date {
    flex: 15%;
  }
`

type Post = {
  id: string
  value: string
  title: string
  reviewWord: string
  publishedDate: string
}

type Review = {
  id: string
  post: Post
}

type SelectOption = {
  id: string
  value: string
  label: string
  itemJSX: ReactNode
}

const Reviews = () => {
  // Queries
  const {
    data: postsData,
    loading: postsDataLoading,
    error: postsDataError,
    refetch: refetchPosts,
  } = useQuery<{ posts: Post[] }>(queries.GET_POSTS, {
    variables: { where: { OR: [] }, orderBy: [{ createdAt: 'desc' }] },
  })

  const {
    data: reviewsData,
    loading: reviewsDataLoading,
    error: reviewsDataError,
  } = useQuery<{ reviews: Review[] }>(queries.GET_REVIEWS, {
    variables: { where: { OR: [] }, orderBy: [{ order: 'asc' }] },
  })

  // Mutations
  const [
    deleteAllAndCreate,
    { loading: deleteAllAndCreateLoading, error: deleteAllAndCreateError },
  ] = useMutation(mutations.DELETE_ALL_REVIEW_AND_BULK_CREATE, {
    refetchQueries: [queries.GET_REVIEWS],
  })

  const transformedOptions: SelectOption[] = useMemo(
    () =>
      postsData?.posts.map((post: Post) => {
        const { id, value, title, reviewWord, publishedDate } = post
        return {
          id,
          value,
          label: title,
          itemJSX: (
            <SortItem>
              <div className="title">{title}</div>
              <div className="review-word">{reviewWord}</div>
              <div className="published-date">
                {new Date(publishedDate).toLocaleDateString()}
              </div>
            </SortItem>
          ),
        }
      }) || [],
    [postsData]
  )

  const initialSelectedOptions: SelectOption[] = useMemo(
    () =>
      reviewsData?.reviews?.map((review: Review) => {
        const { id, post } = review
        const { value, title, reviewWord, publishedDate } = post
        return {
          id,
          value,
          label: title,
          itemJSX: (
            <SortItem>
              <div className="title">{title}</div>
              <div className="review-word">{reviewWord}</div>
              <div className="published-date">
                {new Date(publishedDate).toLocaleDateString()}
              </div>
            </SortItem>
          ),
        }
      }) || [],
    [reviewsData]
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
          post: { connect: { id: value } },
          order: index + 1,
        })),
      },
    })

    if (deleteAllAndCreateError) {
      toasts.addToast({
        title: 'Failed to update review',
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
    refetchPosts()
  }, [initialSelectedOptions, refetchPosts])

  if (postsDataError || reviewsDataError) {
    return (
      <PageContainer header={<Heading type="h3">Latest</Heading>}>
        {`Error: ${postsDataError || reviewsDataError}`}
      </PageContainer>
    )
  }

  if (postsDataLoading || reviewsDataLoading) {
    return (
      <PageContainer header={<Heading type="h3">Reviews</Heading>}>
        Loading...
      </PageContainer>
    )
  }

  return (
    <PageContainer header={<Heading type="h3">Reviews</Heading>}>
      <StyledContainer>
        <FieldLabel>我的閱讀頁 / 報導回顧</FieldLabel>
        <FieldDescription id="description">
          選取值得推薦讀者回顧的文章，並可顯示回顧說明
        </FieldDescription>
      </StyledContainer>

      <StyledContainer>
        <FieldLabel>文章</FieldLabel>
        <MultiSelect
          value={selectedOption}
          options={transformedOptions}
          onChange={setSelectedOption}
        />
        {(selectedOption.length > 0 && (
          <Link
            href={`/posts?!id_in="${selectedOption
              .map(({ value }) => value)
              .join(',')}"`}
          >
            View related Posts
          </Link>
        )) ||
          null}
      </StyledContainer>

      {selectedOption.length > 0 && (
        <StyledContainer>
          <FieldLabel>排序</FieldLabel>
          <FieldDescription id="description">拖曳來排序</FieldDescription>
          <InfoColumn>
            <div className="title">文章標題</div>
            <div className="review-word">回顧說明</div>
            <div className="published-date">發布日期</div>
          </InfoColumn>
          <DnD
            items={selectedOption}
            setItems={setSelectedOption}
            emptyPlachholder={'請選擇文章'}
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

export default Reviews
