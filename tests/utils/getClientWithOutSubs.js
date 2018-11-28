import ApolloBoost from 'apollo-boost'

const getClient = jwt => {
  return new ApolloBoost({
    uri: 'http://localhost:4000',
    onError: () => {
      /* This will ignore erros on gql */
    },
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })
}

export { getClient as default }
