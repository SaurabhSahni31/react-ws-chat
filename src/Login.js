import React from "react";

function Login({ userName, setUserName, handleLogin }) {
  return (
    <div className="m-T10r">
      <h2>Login</h2>
      <input
        className="textBox"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your username"
      />
      <div className="p-T10">
        <button className="Submit" onClick={() => handleLogin(userName)}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Login;
