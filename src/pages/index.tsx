import { withUrqlClient } from "next-urql";
import React from "react"
import { Navbar } from "../components/Navbar"
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
      const [{data}] = usePostsQuery();
      return (
        <>
          <Navbar />
          <div>Hello World!</div>
          <br/>
          {
            data
              ? data.posts.map((post) => <p key={post.id}>{post.title}</p>)
              : <div>Loading...</div>
          }
        </>
      );
};

export default withUrqlClient(createUrqlClient)(Index);
