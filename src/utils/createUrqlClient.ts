import { dedupExchange, Exchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
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

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
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
