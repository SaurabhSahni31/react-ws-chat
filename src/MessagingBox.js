import React, { useState } from "react";

function MessagingBox({ setMessage }) {
  const [inputValue, setInputValue] = useState("");

  const messageHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    setMessage((prevMessages) => [...prevMessages, inputValue]);
    setInputValue("");
  };

  return (
    <div className="messagingBox">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={messageHandler}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MessagingBox;
