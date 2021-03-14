import {
    dedupExchange,
    Exchange,
    fetchExchange,
    stringifyVariables,
} from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
    LogoutMutation,
    MeQuery,
    MeDocument,
    LoginMutation,
    RegisterMutation,
    ChangePasswordMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => op$ => {
    return pipe(
        forward(op$),
        tap(({ error }) => {
            if (error && error.message.includes("Not Authenticated")) {
                Router.replace("/login");
            }
        })
    );
};

export type MergeMode = "before" | "after";

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
    mergeMode?: MergeMode;
}

export const cursorPagination = (_cursorArgument = "skip"): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(
            info => info.fieldName === fieldName
        );
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            "posts"
        );
        
        info.partial = !isItInCache;
        const results: string[] = [];
        let hasMore = true;
        fieldInfos.forEach(fi => {
            const key = cache.resolveFieldByKey(
                entityKey,
                fi.fieldKey
            ) as string;
            console.log("keyResolveFieldByKey: ", key);
            const data = cache.resolve(key, "posts") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });
        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results
        };
        // https://raw.githubusercontent.com/FormidableLabs/urql/main/exchanges/graphcache/src/extras/simplePagination.ts
    };
};

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            keys: {
                PaginatedPosts: () => null
            },
            resolvers: {
                Query: {
                    posts: cursorPagination(),
                },
            },
            updates: {
                Mutation: {
                    changePassword: (_result, _1, cache, _2) => {
                        betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.changePassword.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.changePassword.user,
                                    };
                                }
                            }
                        );
                    },
                    logout: (_result, _1, cache, _2) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        );
                    },
                    login: (_result, _1, cache, _2) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },
                    register: (_result, _1, cache, _2) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user,
                                    };
                                }
                            }
                        );
                    },
                },
            },
        }),
        errorExchange,
        ssrExchange,
        fetchExchange,
    ],
});
