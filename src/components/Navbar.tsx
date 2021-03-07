import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
    const [{ fetching:logoutFetching },logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    let body = null;
    if (fetching) {
    } else if (!data?.me) {
        body = (
            <Box ml="auto">
                <NextLink href="/login">
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </Box>
        );
    } else {
        body = (
            <Flex ml="auto">
                <Box>{data.me.username}</Box>
                <Button ml="2" variant="link" onClick={ () => logout() } isLoading={logoutFetching}>
                    Logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex zIndex="1" bg="tan" position="sticky" top="0" p={4} ml="auto">
            {body}
        </Flex>
    );
};
