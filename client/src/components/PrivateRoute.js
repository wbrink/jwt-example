import React, {useEffect, useState} from "react";
import {Redirect, Route} from "react-router-dom";

function PrivateRoute({ component: Component, ...rest}) {
  const [loggedIn, setLoggedIn] = useState(null);

  // make fetch call to see if user is logged in
  useEffect(() => {
    const abortCtrl = new AbortController();
    const opts = {signal: abortCtrl.signal};

    fetch("/api/isLoggedIn")
      .then(res => {
        if (res.status >= 400 && res.status <= 600) {
          console.log("not logged in");
          return {authorized: false}
        } else {
          return res.json();
        }
      })
      .then(data => {
        setLoggedIn(data.authorized);
      })
      .catch(error => {
        console.log("caught an error", error);

        if (error.name === "AbortError") {
          console.log("request was cancelled");
        }
      })
      

    return () => abortCtrl.abort();
  }, [])

  return (
    <div>
      {/* if fetch call has not loaded then leave blank screen */}
      {loggedIn == null && ("ddd") }
      {loggedIn !== null && <Route {...rest} render={(props) => loggedIn ? <Component {...props} /> : <Redirect to={{pathname: "/redirected", state: {from: props.location}}} /> } /> }
    </div>
  )
}

 


export default PrivateRoute;