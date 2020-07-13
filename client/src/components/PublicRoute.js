import React from "react";
import {Redirect, Route} from "react-router-dom";
import isLoggedIn from "../utils/isLoggedin";

function PublicRoute({component: Component, restricted, ...rest}) {
  return (
    <Route {...rest} 
      render={(...routeProps) => isLoggedIn && restricted==false ? <Component {...routeProps} /> : <Redirect to="/" />} 
    />
  )
}