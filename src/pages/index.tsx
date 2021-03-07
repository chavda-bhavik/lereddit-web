import { withUrqlClient } from "next-urql";
import React from "react"
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { Link } from "@chakra-ui/react";

const Index = () => {
      const [{ data }] = usePostsQuery({
        variables: {
          limit: 10,
          cursor: ""
        }
      });
      return (
        <Layout>
          <div>Hello World!</div>
          <NextLink href="/create-post">
            <Link>
              Create New Post
            </Link>
          </NextLink>
          <br/>
          {
            data
              ? data.posts.map((post) => <p key={post.id}>{post.title}</p>)
              : <div>Loading...</div>
          }
        </Layout>
      );
};

export default withUrqlClient(createUrqlClient)(Index);
