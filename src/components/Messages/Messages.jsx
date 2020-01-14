import React, { Fragment, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";

const Messages = ({ currentChannel, currentUser }) => {
  const [state, setState] = useState({
    messagesRef: firebase.database().ref("messages"),
    channel: currentChannel,
    user: currentUser
  });

  return (
    <Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">{/* Messages */}</Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={state.messagesRef}
        currentChannel={state.channel}
        currentUser={state.user}
      />
    </Fragment>
  );
};

export default Messages;
