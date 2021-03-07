import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { useState } from "react";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: NextPage = ({}) => {
    const [, forgotPassword] = useForgotPasswordMutation();
    const [msg, setMsg] = useState({
        type: "",
        text: "",
    });
    return (
        <Formik
            initialValues={{ email: "" }}
            onSubmit={async values => {
                let response = await forgotPassword({
                    email: values.email,
                });
                if (response.data?.forgotPassword) {
                    setMsg({
                        type: "green",
                        text: "reset password link sent to your email address",
                    });
                } else {
                    setMsg({
                        type: "red",
                        text: "email address not found",
                    });
                }
            }}
        >
            {({ isSubmitting }) => (
                <Wrapper variant="small">
                    <Form>
                        <InputField
                            name="email"
                            placeholder="Email"
                            label="Email"
                            type="email"
                            required={true}
                        />
                        {msg.type && <Box color={msg.type}>{msg.text}</Box>}
                        <Button
                            type="submit"
                            colorScheme="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Forgot Password
                        </Button>
                    </Form>
                </Wrapper>
            )}
        </Formik>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
