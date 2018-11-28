import { gql } from 'apollo-boost'

const createUser = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`

const login = gql`
  mutation($data: LoginUserInput!) {
    login(data: $data) {
      token
    }
  }
`

const meQuery = gql`
  query {
    me {
      id
      name
      email
    }
  }
`

export { createUser, getUsers, login, meQuery }
