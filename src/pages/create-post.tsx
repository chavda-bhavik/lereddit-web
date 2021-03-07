import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
    const [, createPost] = useCreatePostMutation();
    const router = useRouter();
    const [error] = useState("");
    useIsAuth();
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async values => {
                    try {
                        let response = await createPost({
                            title: values.title,
                            text: values.text,
                        });
                        if (!response.error) {
                            router.push("/");
                        }
                    } catch (error) {
                        console.log("error:", error);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="Title"
                            label="Title"
                            type="text"
                        />
                        <InputField
                            name="text"
                            placeholder="Text"
                            label="Text"
                            type="text"
                        />
                        {error && <Box color="red">{error}</Box>}
                        <Button
                            type="submit"
                            colorScheme="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Create Post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
