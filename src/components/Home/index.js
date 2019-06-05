import React, { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../App";
import { FirebaseContext } from "../Firebase";
import { useInput, useSubmit } from "../../custom-hooks";
import { validations } from "../../constants/validation-regex";
import { Button, TextField } from "@material-ui/core";

const Home = () => {
  const authUser = useContext(AppStateContext).AppState.userState;

  return (
    <div>
      <h1>Home</h1>
      <p>This page is availble to every signed in user</p>
      <p>{`Welcome ${authUser.firstName}`}</p>

      <Messages />
    </div>
  );
};

export default Home;

const Messages = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AppStateContext).AppState.userState;

  useEffect(() => {
    setLoading(true);
    const listener = firebase
      .messages()
      .orderBy("createdAt")
      .onSnapshot(snapshot => {
        //console.log(snapshot.empty);
        let newMessages = [];
        if (snapshot.empty) {
          setLoading(false);
          newMessages = null;
        } else {
          snapshot.forEach(doc => {
            newMessages.push({ ...doc.data(), messageId: doc.id });
          });
        }
        setMessages(newMessages);
        setLoading(false);
      });
    return () => {
      listener();
    };
  }, []);

  const onCreateMessage = data => {
    let obj = {
      ...data,
      userId: authUser.uid,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()).seconds
    };
    firebase.messages().add(obj);
  };

  const onRemoveMessage = messageId => {
    firebase.message(messageId).delete();
  };

  const onEditMessage = (message, text) => {
    firebase.message(message.messageId).update({
      text: text,
      editedAt: firebase.firestore.Timestamp.fromDate(new Date()).seconds
    });
  };

  const messageInput = useInput("text", "", validations.ANY);
  const submit = useSubmit([messageInput], onCreateMessage, true);

  const isInvalid = Boolean(!messageInput.props.value);
  return (
    <div>
      {loading && <div>Loading ...</div>}
      {messages ? (
        <MessageList
          authUser={authUser}
          messages={messages}
          onEditMessage={onEditMessage}
          onRemoveMessage={onRemoveMessage}
        />
      ) : (
        <div>There are no messages ...</div>
      )}

      <form {...submit.props}>
        <TextField {...messageInput.props} label="Write a message" fullWidth />
        <Button
          //className={classes.submit}
          disabled={isInvalid}
          color="primary"
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

const MessageList = ({
  messages,
  onRemoveMessage,
  onEditMessage,
  authUser
}) => {
  return (
    <ul>
      {messages.map(message => (
        <MessageItem
          authUser={authUser}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
          key={message.messageId}
          message={message}
        />
      ))}
    </ul>
  );
};

const MessageItem = ({ message, onRemoveMessage, onEditMessage, authUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };

  const onChangeEditText = e => {
    setEditText(e.target.value);
  };

  const onSaveEditText = () => {
    onEditMessage(message, editText);
    setEditMode(false);
  };

  return (
    <li>
      {editMode ? (
        <TextField type="text" value={editText} onChange={onChangeEditText} />
      ) : (
        <span>
          <strong>{message.userId}</strong> {message.text}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}
      {authUser.uid === message.userId && (
        <span>
          {editMode ? (
            <span>
              <Button
                color="primary"
                variant="contained"
                onClick={onSaveEditText}
              >
                Save
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={onToggleEditMode}
              >
                Reset
              </Button>
            </span>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={onToggleEditMode}
            >
              Edit
            </Button>
          )}
          {!editMode && (
            <Button
              color="primary"
              variant="contained"
              type="button"
              onClick={() => onRemoveMessage(message.messageId)}
            >
              Delete
            </Button>
          )}
        </span>
      )}
    </li>
  );
};
