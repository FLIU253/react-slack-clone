import React, { useState } from "react";
import firebase from "../../firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const { email, password } = form;

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid()) {
      setErrors({ message: "" });
      setLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          console.log(signedInUser);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setErrors({ message: err.message });
        });
    }
  };

  const isFormValid = () => email && password;

  const displayErrors = () => {
    if (errors) {
      return <p>{errors.message}</p>;
    }
  };

  const handleInputError = inputName => {
    return errors.message.toLowerCase().includes(inputName) ? "error" : "";
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="code branch" color="violet" />
          Login to DevChat
        </Header>
        <Form size="large" onSubmit={event => handleSubmit(event)}>
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="email address"
              onChange={event => handleChange(event)}
              value={email}
              type="email"
              className={handleInputError("email")}
            />

            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="password"
              onChange={event => handleChange(event)}
              value={password}
              className={handleInputError("password")}
              type="password"
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="violet"
              fluid
              size="large"
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {errors.message.length > 1 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors()}
          </Message>
        )}
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
