import React, {useEffect, useState} from "react";

function PageRedirection(props) {
  const [redirected, setRedirected] = useState(false);
  const [path, setPath] = useState("");

  const handleClick = () => {
    // this button will only show if there is a redirected "from state"
    props.history.push(props.location.state.from);
    
  }

  useEffect(() => {
    console.log(props);
    if (props.location?.state?.from?.pathname !== undefined) {
      console.log("optional chaining worked");
      setRedirected(true);
      setPath(props.location.state.from.pathname)
    } 

    // if (props) {
    //   if (props.hasOwnProperty('location')) {
    //     console.log("has location");
    //     if (props.location.hasOwnProperty("state")) {
    //       console.log("has state");
    //       if (props.location.state.hasOwnProperty("from")) {
    //         console.log("has from");
    //         if (props.location.state.from.hasOwnProperty("pathname")) {
    //           console.log("here is the pathname");
    //           setRedirected(true);
    //           setPath(props.location.state.from.pathname);
    //         }
    //       }
    //     }
    //   }
    // }
    
  }, [])

  return (
    <div>
          <h1>Redirected Page When not logged in</h1>
          {redirected ? <button onClick={handleClick}>Go to redirected route {path}</button> : ""}
    </div>

    
  )
}

export default PageRedirection;