import { withUrqlClient } from "next-urql";
import React, { useState } from "react"
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from "@chakra-ui/react";

const Index = () => {
  const [variables, setVariables] = useState <{limit:number, cursor: string|null}>({ limit: 10, cursor: null });
      const [{ data, fetching }] = usePostsQuery({
        variables
      });
  
      if (!fetching && !data) {
        return <div>Query failed for some reason</div>
      }
      return (
          <Layout>
              <Flex>
                <Heading>LeReddit</Heading>
                  <NextLink href="/create-post">
                    <Link as={Button} backgroundColor="blackAlpha.600" color="burlywood" ml="auto">      
                      Create New Post
                    </Link>
                  </NextLink>
              </Flex>
          {
            (!data && fetching) ? (
              <div>Loading...</div>
            ): (
              <Stack spacing={8}>
              {data?.posts.posts.map(post => (
                  <Box
                      p={5}
                      shadow="md"
                      borderWidth="1px"
                      key={post.id}
                  >
                      <Heading fontSize="xl">{post.title}</Heading>
                      <Text mt={4}>{post.textSnippet}</Text>
                  </Box>
              ))}
          </Stack>
          )}
          {
            (data && data.posts.hasMore ) &&
            (
              <Flex>
                <Button onClick={() => {
                  setVariables({
                    limit: variables.limit,
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                  });
                }} my={4} isLoading={fetching} margin="auto" colorScheme="messenger">
                Load More
              </Button>
            </Flex>
            )
          }
          </Layout>
      );
};

export default withUrqlClient(createUrqlClient)(Index);
