import { useState, useEffect } from "react";
import "./Authentication.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { useNavigate } from "react-router-dom";
import server from "../environment.js";

export default function Authentication() {
  let [formState, setformState] = useState(0);
  let [fullname, setfullname] = useState("");
  let [username, setusername] = useState("");
  let [password, setpassword] = useState("");
  let [resMsg , setResMsg] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.id === "fullname") {
      setfullname(event.target.value);
    } else if (event.target.id === "username") {
      setusername(event.target.value);
    } else if (event.target.id === "password") {
      setpassword(event.target.value);
    }
  };

  // const checkResult = (result) => {
  //   if(result.message === "User logged-IN") {
        
  //     navigate("/home");
  //   }
  // }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let formData = {
      name: formState === 1 ? fullname : "",
      username: username,
      password: password,
    };

    try {
      let url = `${server}/user/`;
      url += formState === 0 ? "login" : "register";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      

      if(result.token) { 
        localStorage.setItem("token" , result.token);
        navigate("/home");
      } else {
        //console.log("server response : ", result);
        setResMsg(result.message);
      }


    } catch (error) {
      console.error("Error: ", error);
    }

    //console.log(formData);

    setfullname("");
    setusername("");
    setpassword("");
  };

  return (
    <div className="authContainer">
      <div className="authBackground"></div>

      <div className="authDiv">
        <div className="authAvatar" style={{ textAlign: "center" }}>
          <AccountCircleIcon fontSize="large" />
          <div className="btns" style={{ marginTop: "12px" }}>
            <Button
              variant={formState === 0 ? "contained" : ""}
              onClick={() => {setformState(0) , setResMsg("")}}
              sx={{ backgroundColor: formState === 0 ? "brown" : "" }}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? "contained" : ""}
              onClick={() => {setformState(1) , setResMsg("")}}
              sx={{ backgroundColor: formState === 1 ? "brown" : "" }}
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="authForm">
          <form onSubmit={handleFormSubmit}>
            {formState === 1 ? (
              <section>
                <label htmlFor="fullname">Full Name</label> &nbsp;
                <input
                  type="text"
                  id="fullname"
                  placeholder="Aditya Sinha"
                  value={fullname}
                  onChange={handleInputChange}
                  required
                />
              </section>
            ) : (
              ""
            )}

            <section>
              <label htmlFor="username">Username</label> &nbsp;
              <input
                type="text"
                id="username"
                placeholder="adityasinha06"
                value={username}
                onChange={handleInputChange}
                required
              />
            </section>

            <section>
              <label htmlFor="password">Password</label> &nbsp;
              <input
                type="password"
                id="password"
                placeholder="Input password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </section>

            <button>submit</button>
          </form>
        </div>

        <div className="errorMsg" style={{margin:"5px"}}>{resMsg}</div>
      </div>
    </div>
  );
}
