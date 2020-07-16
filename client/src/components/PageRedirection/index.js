import React, {useEffect} from "react";

function PageRedirection(props) {

  const handleClick = () => {
    if (props.hasOwnProperty('location')) {
      console.log("has location");
      if (props.hasOwnProperty("state")) {
        console.log("has state");
        if (props.hasOwnProperty("from")) {
          console.log("has from");
          if (props.hasOwnProperty("pathname")) {
            console.log("has pathname");
          }
        }

      }
    }
    // props.history.push(props.location.state.from.pathname)
  }

  useEffect(() => {
    console.log("Props for redirected", props);
  }, [])

  return (
    <div>
          <h1>Redirected Page When not logged in</h1>
          <button onClick={handleClick}>Go to redirected route</button>
    </div>

    
  )
}

export default PageRedirection;