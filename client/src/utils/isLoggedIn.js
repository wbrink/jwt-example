async function isLoggedIn() {
  // make a fetch call to see if loggedIn
  const res = await fetch("/api/isLoggedIn");
  console.log(res);
  // if there was an error then we were unauthorized
  if (res.status >= 400 && res.status <= 600) {
    console.log("returning false");
    return false; 
  }

  const data = await res.json();
  if (data.authorized) {
    return true;
  } else {
    return false;
  }
}


export default isLoggedIn;