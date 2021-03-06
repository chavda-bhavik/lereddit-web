import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
                let response = await login({ options: values });
                if (response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors));
                } else {
                    router.push("/");
                }
            }}
        >
            {({ isSubmitting }) => (
                <Wrapper variant="small">
                    <Form>
                        <InputField
                            name="username"
                            placeholder="Username"
                            label="username"
                            type="text"
                        />
                        <Box mt={4}>
                            <InputField
                                type="password"
                                name="password"
                                placeholder="Password"
                                label="Password"
                            />
                        </Box>
                        <Button
                            type="submit"
                            colorScheme="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default withUrqlClient(createUrqlClient)(login);
