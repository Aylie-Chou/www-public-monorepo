import { Button } from '@keystar/ui/button'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import { gql, useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'
import {
  type NavigationProps,
  NavContainer,
  NavFooter,
  NavItem,
  NavList,
  getHrefFromList,
} from '@keystone-6/core/admin-ui/components'
import { RoleEnum } from '../../lists/utils/access-control-list'

const SESSION = gql`
  query CmsNavigationSession {
    authenticatedItem {
      ... on ReporterSystemUser {
        id
        name
        role
      }
    }
  }
`
const END_SESSION = gql`
  mutation CmsEndSession {
    endSession
  }
`

export function CustomNavigation({ lists }: NavigationProps) {
  const router = useRouter()
  const { data, loading, error } = useQuery<{
    authenticatedItem: { id: string; name: string; role: string } | null
  }>(SESSION)
  const [endSession, { loading: signingOut }] = useMutation(END_SESSION)
  const user = data?.authenticatedItem
  const canCurate =
    !!user &&
    [
      RoleEnum.Owner,
      RoleEnum.Admin,
      RoleEnum.Editor,
      RoleEnum.Contributor,
    ].includes(user.role)

  return (
    <NavContainer>
      <NavList>
        <NavItem href="/">Dashboard</NavItem>
        {lists.map((list) => (
          <NavItem key={list.key} href={getHrefFromList(list)}>
            {list.label}
          </NavItem>
        ))}
        {canCurate && <NavItem href="/latest">Latests</NavItem>}
        {canCurate && <NavItem href="/review">Reviews</NavItem>}
      </NavList>
      <NavFooter>
        {loading && <div>Loading navigation...</div>}
        {error && (
          <div>Unable to load navigation. Please try refreshing the page.</div>
        )}
        {user && (
          <Button
            isPending={signingOut}
            onPress={async () => {
              await endSession()
              await router.push('/signin')
            }}
          >
            Sign out
          </Button>
        )}
      </NavFooter>
    </NavContainer>
  )
}
