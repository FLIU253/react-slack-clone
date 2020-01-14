import React, { Fragment, useState, useEffect } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import Message from "./Message";

const Messages = ({ currentChannel, currentUser }) => {
  useEffect(() => {
    if (state.channel && state.user) {
      addListeners(state.channel.id);
    }
  }, []);

  const [state, setState] = useState({
    messagesRef: firebase.database().ref("messages"),
    channel: currentChannel,
    user: currentUser,
    messages: [],
    messagesLoading: true
  });

  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  const addMessageListener = channelId => {
    let loadedMessages = [];
    state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());

      setState({ ...state, messages: loadedMessages, messagesLoading: false });
    });
  };

  const displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message key={message.timestamp} message={message} user={state.user} />
    ));

  return (
    <Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages">
          {displayMessages(state.messages)}
        </Comment.Group>
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
