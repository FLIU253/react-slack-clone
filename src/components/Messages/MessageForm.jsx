import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../firebase";

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
  const [state, setState] = useState({
    message: "",
    loading: false,
    channel: currentChannel,
    user: currentUser,
    errors: ""
  });

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const sendMessage = () => {
    if (state.message) {
      setState({ ...state, loading: true });
      messagesRef
        .child(state.channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setState({ ...state, loading: false, message: "" });
          console.log("message sent");
        })
        .catch(err => {
          console.error(err);
          setState({
            ...state,
            loading: false,
            errors: err
          });
        });
    } else {
      setState({
        ...state,
        errors: "Add a message"
      });
    }
  };

  const createMessage = () => {
    const message = {
      content: state.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: state.user.uid,
        name: state.user.displayName,
        avatar: state.user.photoURL
      }
    };
    return message;
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        value={state.message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
        className={state.errors.length > 1 ? "error" : ""}
        onChange={event => handleChange(event)}
      />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          disabled={state.loading}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
