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

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const [errors, setErrors] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const { username, email, password, passwordConfirmation } = form;

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    if (isFormValid()) {
      setErrors({ message: "" });
      setLoading(true);

      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          setErrors({ message: err.message });
        });
    }
  };

  const isFormValid = () => {
    let error;
    if (isFormEmpty()) {
      //throw error
      error = { message: "Fill in all fields" };
      setErrors(error);
      return false;
    } else if (!isPasswordValid()) {
      //throw error
      error = { message: "Password is invalid" };
      setErrors(error);
      return false;
    } else {
      //form valid
      return true;
    }
  };

  const isFormEmpty = () => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = () => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

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
        <Header as="h2" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form size="large" onSubmit={event => handleSubmit(event)}>
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={event => handleChange(event)}
              value={username}
              className={handleInputError("username")}
              type="text"
            />

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

            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="password confirmation"
              onChange={event => handleChange(event)}
              className={handleInputError("password")}
              value={passwordConfirmation}
              type="password"
            />

            <Button
              disabled={loading}
              className={loading ? "loading" : ""}
              color="orange"
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
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
