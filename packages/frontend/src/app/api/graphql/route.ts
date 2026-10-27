import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import keystoneFetch, { type GraphQLResponse } from '@/app/api/graphql/keystone'
import logger from '@/utils/logger'

type Body = {
  query: string
  variables?: Record<string, string>
}

export async function POST<T>(req: NextRequest) {
  const body = await req.json()
  const { query, variables } = body
  const requestId = randomUUID()
  logger.info({ requestId, request: body }, 'incoming API request')

  const bodyForKeystone: Body = { query }
  if (variables) {
    bodyForKeystone.variables = variables
  }

  try {
    const response: GraphQLResponse<T> = await keystoneFetch<T>(
      JSON.stringify(bodyForKeystone),
      true
    )
    logger.debug({ requestId, response }, 'keystone api response')
    return NextResponse.json(response)
  } catch (error) {
    let errMsg = ''
    if (error instanceof Error) {
      errMsg = error.message
    }
    logger.error(error, 'keystone api error')
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
