import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";


function Login(props) {

  const [username, setUsername] = useState("");
  const [allowed, setAllowed] = useState("");

  // submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username})
      });

      // get the token
      const token = await res.json(); // 
      localStorage.setItem("token", JSON.stringify(token))
      console.log(token);
    } catch (error) {
      console.log("there was an error AJAX")
    }
    
  }

  const handleClick = async () => {
    try { 
      const res = await fetch("/api/protected", {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`}})
      if (res.status >=400 && res.status < 600) {
        setAllowed("forbidden");
        return;
      }
      const data = await res.json();
      // if allowed
      if (data.allowed) {
        setAllowed("i am allowed");
      } else {
        setAllowed("not allowed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // jsx
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
      </form>
      <button onClick={handleClick}>Test Protected Route</button>
      <p>Allowed: {allowed}</p>
    </div>
    
  )
}

export default Login;