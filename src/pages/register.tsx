import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUTATION = `
mutation register($username: String!, $password: String!) {
    register(options: {
      username: $username,
      password: $password,
    }) {
      errors {
              field
          message
      }
      user {
        id
        username
        createdAt
          updatedAt
      }
    }
}  
`;

const register: React.FC<registerProps> = ({}) => {
    const [ ,register] = useMutation(REGISTER_MUTATION);
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={values => {
                console.log("submitted", values);
                return register(values);
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
