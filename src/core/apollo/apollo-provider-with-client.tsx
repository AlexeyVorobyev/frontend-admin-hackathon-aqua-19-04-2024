import {FC, ReactNode} from 'react'
import {ApolloClient, ApolloLink, ApolloProvider, createHttpLink, fromPromise, InMemoryCache} from '@apollo/client'
import {serverErrorAfterware} from './afterware/server-error-afterware.ts'
import {GLOBAL_CONFIG} from '../../globalConfig.ts'
import {setContext} from '@apollo/client/link/context'
import {
    ETokenAndExpiryLocalStorageKeys,
    getTokensAndExpiry, setTokensAndExpiry,
} from '../../components/function/auth-token-and-expiry.function.ts'
import {onError} from '@apollo/client/link/error'
import {ApolloGetAuthRefreshDocument} from './types/graphql/graphql.ts'

const refreshTokens = async () => {
    try {
        const response = await defaultClient.query({
            query: ApolloGetAuthRefreshDocument,
            variables: {
                input: {
                    token: getTokensAndExpiry().refreshToken!,
                },
            },
        })

        if (response.data.auth.refresh) {
            setTokensAndExpiry(response.data.auth.refresh)
        } else {
            localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.accessToken)
            localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.refreshToken)
            localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.refreshExpiry)
            localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.accessExpiry)
        }
    } catch (e) {
        localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.accessToken)
        localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.refreshToken)
        localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.refreshExpiry)
        localStorage.removeItem(ETokenAndExpiryLocalStorageKeys.accessExpiry)
    }
}

const httpLinkAuth = createHttpLink({
    uri: GLOBAL_CONFIG.apiAuthServiceAddress,
})

const httpLinkMain = createHttpLink({
    uri: GLOBAL_CONFIG.apiMainServiceAddress,
})

type TOriginalError = {
    statusCode: number
}

export const errorLink = onError(({graphQLErrors, operation, forward}) => {
    console.debug(graphQLErrors)
    if (graphQLErrors) {
        switch ((graphQLErrors[0] as any)?.statusCode) {
            case 400: {
                return fromPromise(refreshTokens()).flatMap(() => {
                    return forward(operation)
                })
            }
        }
    }
})

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem(ETokenAndExpiryLocalStorageKeys.accessToken)

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
})

const defaultClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(
        authLink.concat(
            serverErrorAfterware.concat(
                ApolloLink.split(
                    operation => operation.getContext().clientName === EGraphqlLinks.auth,
                    httpLinkMain,
                    httpLinkAuth
                )
            ),
        ),
    ),
})

interface IApolloProviderWithClientProps {
    children: ReactNode
}

export enum EGraphqlLinks {
    auth = 'httpLinkAuth',
    main = 'httpLinkMain'
}

export const ApolloProviderWithClient: FC<IApolloProviderWithClientProps> = ({children}) => (
    <ApolloProvider client={defaultClient}>
        {children}
    </ApolloProvider>
)