import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";


function Login(props) {

  const [username, setUsername] = useState("");
  const [access, setAccess] = useState("");
  const [refresh, setRefresh] = useState("");
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
      const data = await res.json(); // 
      
      console.log(data);
      setAccess(data.accessToken);
      setRefresh(data.refreshToken);
      // localStorage.setItem("token", JSON.stringify(accessToken))
    } catch (error) {
      console.log("there was an error AJAX")
    }
    
  }

  const testProtectedRoute = async () => {
    try { 
      // moved to cookie storage for jwt
      // const res = await fetch("/api/protected", {headers: {"Content-Type": "application/json", "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`}})
      const res = await fetch("/api/protected");
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

  const logout = () => {
    localStorage.removeItem("token");
  }

  const refreshToken = async () => {
    try {
      const res = await fetch("/api/token", {
        method: "POST", 
        headers: {
          "Content-Type" : "application/json"
        },
        body: ""
      })
      
    } catch (error) {
      console.log(error);
      setAllowed(error);
    }
  }

  // jsx
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="submit" value="Submit"/>
      </form>
      <p>The token expires in 15 seconds</p>
      <button onClick={testProtectedRoute}>Test Protected Route</button>
      <button onClick={refreshToken}>Refresh Token</button>
      <button onClick={logout}>Delete Refresh Token and access token (logout)</button>
      <p>Allowed: {allowed}</p>

      <p>Access Token: {access}</p>
      <p>Refresh Token: {refresh}</p>

    </div>
    
  )
}

export default Login;