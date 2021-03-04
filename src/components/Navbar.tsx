import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const [{ data, fetching }] = useMeQuery();
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
                <Button ml="2" variant="link">
                    Logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex bg="tan" p={4} ml="auto">
            {body}
        </Flex>
    );
};