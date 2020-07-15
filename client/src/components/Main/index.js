import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";


function Main(props) {

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
      const data = await res.json(); // 
      
      console.log(data);
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

  const logout = async () => {
    try {
      const res = await fetch("/api/logout");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
      <h1>JWT Example</h1>
      <p>
        This is a small implementation of JSON Web Tokens for API authentication. The <i>Test Protected Route</i> Button makes a AJAX request to a protected route on an API. 
        The <i>Refresh Token</i> button allows a new access token to be granted to the user. 
        The <i>Logout</i> button expires the Access and Refresh token that was given to the user when they submitted the fake login form. Check the inspector tools to view the cookies being made and expired.
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="submit" value="Login"/>
      </form>
      <p>The token expires in 15 seconds</p>
      <button onClick={testProtectedRoute}>Test Protected Route</button>
      <button onClick={refreshToken}>Refresh Token</button>
      <button onClick={logout}>Logout</button>
      <p>Allowed: {allowed}</p>

      

    </div>
    
  )
}

export default Main;