import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { connect } from "react-redux";

const DirectMessages = ({
  currentUser,
  setCurrentChannel,
  setPrivateChannel
}) => {
  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(currentUser);
  const [usersRef, setUsersRef] = useState(firebase.database().ref("users"));
  const [connectedRef, setConnectedRef] = useState(
    firebase.database().ref(".info/connected")
  );
  const [presenceRef, setPresenceRef] = useState(
    firebase.database().ref("presence")
  );

  const addListeners = currentUserUid => {
    let loadedUsers = [];
    usersRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);

        setUsers(loadedUsers);
      }
    });

    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        //add status to user
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        //add status to user
        addStatusToUser(snap.key, false);
      }
    });
  };

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }

      return acc.concat(user);
    }, []);

    setUsers(updatedUsers);
  };

  const isUserOnline = user => user.status === "online";

  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };

    setCurrentChannel(channelData);
    setPrivateChannel(true);
  };

  const getChannelId = userId => {
    const currentUserId = user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>
        ({users.length})
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@{" "}
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
