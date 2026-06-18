import { useNavigate } from "react-router-dom";
import WithAuth from "../utils/WithAuth.jsx";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import "./HomeComponent.css";
import  server  from "../environment.js";
import { Link } from "react-router-dom";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  let [username , setUsername] = useState("");

  useEffect(() => {
    let findUsername = async () => {
      const url = `${server}/user/findUsername?token=${localStorage.token}`;
      let response = await fetch(url , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();
      setUsername(result);
    }

    findUsername();
  } , []);

  let handleJoinVideoCall = async () => {
    let meetingData = {
        token: localStorage.token,
        meetingCode : meetingCode,
    }

    try {
      const url = `${server}/user/add_to_activity`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });

      const result = await response.json();
      console.log(result);
      
      if(result.message === "Meeting added ") navigate(`/${meetingCode}`);
    } catch (e) {
      console.log(e);
    }

  };

  return (
      <div className="homeContainer">
        <nav className="homeNav">
          <div className="logoDiv">
            <Link to="" style={{ textDecoration: "none", color: "azure" }}>
              <h2>letsCHAT Video Call</h2>
            </Link>
          </div>

          <div className="menus">
            <Link to="/getHistory" style={{ textDecoration: "none" }}>
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>History</span>
            </Link>

            <Button
              variant="contained"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
              style={{ backgroundColor: "red" }}
            >
              logout
            </Button>
          </div>
        </nav>

        <div className="homeMainContainer">
          <div className="panel">
            <h2>Hi, {username}</h2>
            <p style={{ fontSize: "larger" }}>Join or Create a meeting:</p> <br />
            <TextField
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              style={{ backgroundColor: "white" }}
              variant="outlined"
              placeholder="Input Meeting ID"
            ></TextField>
            <Button
              onClick={handleJoinVideoCall}
              variant="contained"
              style={{ marginLeft: "15px" }}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
  );
}

export default WithAuth(HomeComponent);
