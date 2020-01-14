import React, { useState, Fragment, useEffect } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";

const Channels = ({ currentUser, setCurrentChannel }) => {
  const [state, setState] = useState({
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    user: currentUser,
    firstLoad: true,
    activeChannel: ""
  });

  useEffect(() => {
    addListeners();
    setFirstChannel();

    return () => removeListeners();
  }, [state.channels]);

  const addListeners = () => {
    let loadedChannels = [];
    state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      setState({ ...state, channels: loadedChannels });
    });
  };

  const removeListeners = () => {
    state.channelsRef.off();
  };

  const setFirstChannel = () => {
    if (state.firstLoad && state.channels.length > 0) {
      setCurrentChannel(state.channels[0]);
      setActiveChannel(state.channels[0]);
    }

    setState({ ...state, firstLoad: false });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid(state)) {
      addChannel();
    }
  };

  const addChannel = () => {
    const key = state.channelsRef.push().key;

    const newChannel = {
      id: key,
      name: state.channelName,
      details: state.channelDetails,
      createdBy: {
        name: state.user.displayName,
        avatar: state.user.photoURL
      }
    };

    state.channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setState({ ...state, channelName: "", channelDetails: "" });
        closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  const isFormValid = () => state.channelName && state.channelDetails;

  const closeModal = () => {
    setState({ ...state, modal: false });
  };

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const changeChannel = channel => {
    setActiveChannel(channel);
    setCurrentChannel(channel);
  };

  const setActiveChannel = channel => {
    setTimeout(() => {
      setState({ ...state, activeChannel: channel.id });
    }, 200);
  };

  const openModal = () => {
    setState({ ...state, modal: true });
  };

  const displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === state.activeChannel}
        >
          # {channel.name}
        </Menu.Item>
      ))
    );
  };

  return (
    <Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            {" "}
            <Icon name="exchange" /> CHANNELS
          </span>
          ({state.channels && state.channels.length}){" "}
          <Icon name="add" onClick={openModal} />
          {/* Channels */}
        </Menu.Item>
        {displayChannels(state.channels)}
      </Menu.Menu>
      <Modal basic open={state.modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={event => handleChange(event)}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label="About the channel"
                name="channelDetails"
                onChange={event => handleChange(event)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>

          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default connect(null, { setCurrentChannel })(Channels);
