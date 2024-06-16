import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import { compactVerify } from 'jose'
import axios from 'axios'

const decodeToken = (
  token: string
): {
  token_type: 'access' | 'refresh'
  exp: number
  iat: number
  jti: string
  user_id: number
  type: number
} => {
  return JSON.parse(atob(token.split('.')?.at(1) || ''))
}

const jwt = async ({ token, user }: { token: JWT; user?: User | AdapterUser }) => {
  if (user?.id) {
    return { ...user, ...token }
  }

  // Refresh token
  if (Date.now() / 1000 > decodeToken(token.access).exp) {
    try {
      const res = await axios.post(`${process.env.API_URL}/token/refresh/`, {
        refresh: token.refresh
      })
      token.access = res.data.access
    } catch (error: any) {
      console.error('Failed to refresh token: ', error?.response?.data)
    }
  }

  return { ...token, ...user }
}

const session = async ({ session, token }: { session: Session; token: JWT }): Promise<Session> => {
  try {
    await compactVerify(token.access, new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? ''))
  } catch (err) {
    return Promise.reject({
      error: new Error('Access token has no valid signature. Error: ' + err)
    })
  }

  const access = decodeToken(token.access)
  const refresh = decodeToken(token.refresh)

  if (Date.now() / 1000 > access.exp && Date.now() / 1000 > refresh.exp) {
    return Promise.reject({
      error: new Error('Refresh token expired')
    })
  }

  session.user = {
    id: access.user_id,
    type: access.type
  }

  session.accessToken = token.access

  return session
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    error: '/login/?error-status=true'
  },
  providers: [
    CredentialsProvider({
      id: 'credentialsProvider',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials === undefined) {
          throw new Error('Credentials are undefined. Please try again.')
        }
        try {
          const res = await axios.post(`${process.env.API_URL}/token/`, credentials)
          const access = decodeToken(res.data.access)
          return {
            id: access.user_id,
            access: res.data.access,
            refresh: res.data.refresh,
            type: access.type
          }
        } catch (error: any) {
          const errMessage = error?.response?.data?.detail || 'Error signing in. Please try again.'
          console.error('Sign in error: ', error?.response)
          throw new Error(errMessage)
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    session,
    jwt: jwt
  }
}
