import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [state, setState] = useState({
    file: null,
    isAuthorized: ["image/jpeg", "image/png"]
  });

  const addFile = event => {
    const file = event.target.files[0];

    if (file) {
      setState({ ...state, file });
    }
  };

  const sendFile = () => {
    if (state.file !== null) {
      if (isAuthorized(state.file.name)) {
        const metadata = { contentType: mime.lookup(state.file.name) };
        uploadFile(state.file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  const clearFile = () => setState({ ...state, file: null });

  const isAuthorized = filename => {
    return state.isAuthorized.includes(mime.lookup(filename));
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={event => addFile(event)}
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>

        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
