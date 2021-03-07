import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{ data, fetching }] = useMeQuery();
    useEffect(() => {
        if (!data?.me && !fetching) {
            router.replace("/login?next=" + router.pathname);
        }
    }, [data, router, fetching]);
};
