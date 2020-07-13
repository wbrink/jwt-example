// check if the token is approved
const isLoggedIn = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    let header = new Headers();

    header.append("Authentication", `Bearer ${JSON.parse(localStorage.getItem("token"))}`)
    header.append("Accept", "application/json");
    
    let req = new Request("/api/isLoggedIn", {
      method: "GET",
      headers: header,
    })

    //fetch

  } else {
    return false;
  } 
}


export default isLoggedIn;