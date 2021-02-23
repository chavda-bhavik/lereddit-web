import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";

interface registerProps {}

const register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await register(values);
                if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                    // worked
                    router.push("/");
                }
            }}
        >
            {({ values, handleChange, isSubmitting }) => (
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
                            Register
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default register;
