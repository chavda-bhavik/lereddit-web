import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Formik
            initialValues={{ username: "", email: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await register({
                    options: {
                        username: values.username,
                        password: values.password,
                        email: values.email,
                    },
                });
                if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                    // worked
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
                            label="Username"
                            type="text"
                        />
                        <InputField
                            name="email"
                            placeholder="Email"
                            label="email"
                            type="Email"
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
                            Register
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default withUrqlClient(createUrqlClient)(register);
