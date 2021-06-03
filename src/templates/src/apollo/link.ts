// See https://v4.apollo.vuejs.org/guide-composable/subscription.html
// See https://devlms.com/react-apollo/8-subscriptions/

import { createHttpLink, split } from '@apollo/client/core'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createHttpLink({
  uri:
    process.env.GRAPHQL_URI ??
    // Change to your graphql endpoint.
    '/graphql',
})

// TODO: subscriptions-transport-ws is unmaintained
// switch to use https://github.com/enisdenjo/graphql-ws
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_URI_WS ?? `ws://${location.host}/subscriptions`,
  options: {
    lazy: true,
    reconnect: true,
  },
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
export const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)
