import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    return (
        <Formik
            initialValues={{ newPassword: "" }}
            onSubmit={async (values, { setErrors }) => {
                let response = await changePassword({
                    token:
                        typeof router.query.token === "string"
                            ? router.query.token
                            : "",
                    newPassword: values.newPassword,
                });
                if (response.data?.changePassword.errors) {
                    let errorMap = toErrorMap(
                        response.data.changePassword.errors
                    );
                    if ("token" in errorMap) {
                        setTokenError(errorMap.token);
                    }
                    setErrors(errorMap);
                } else {
                    router.push("/");
                }
            }}
        >
            {({ isSubmitting }) => (
                <Wrapper variant="small">
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="New Password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError && (
                            <Box color="red">
                                {tokenError}
                                <NextLink href="/forgot-password">
                                    <Link color="linkedin.300" margin={2}>
                                        Forgot it Again?
                                    </Link>
                                </NextLink>
                            </Box>
                        )}
                        <Button
                            type="submit"
                            colorScheme="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
