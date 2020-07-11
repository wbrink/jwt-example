import React from "react";
import {Redirect, Route} from "react-router-dom";

function PrivateRoute({ component: Component, ...rest}) {
  return (
    <Route {...props} 
      // route props 
      render={routeProps => isLoggedIn ? <Component {...routeProps} /> : <Redirect to="/login" />} 
    />
  )
}


export default PrivateRoute;