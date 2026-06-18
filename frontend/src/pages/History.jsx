import WithAuth from "../utils/WithAuth";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { server } from "../environment.js";

function History() {
  let [meetings, setMeetings] = useState([]);
  let navigate = useNavigate();
  
  useEffect(() => {
    async function fetchAndSet() {
      try {
        const url = `${server.prod}/user/get_all_activity?token=${localStorage.token}`;
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });


        const result = await response.json();
        console.log(result);

        setMeetings(result);
      } catch (e) {
        console.log(e);
      }
    }

    fetchAndSet();
  }, []);

  return (
    <div className="historyContainer">
      <nav className="homeNav">
        <div className="logoDiv">
          <a href="" style={{ textDecoration: "none", color: "azure" }}>
            <h2>letsCHAT Video Call</h2>
          </a>
        </div>

        <div className="menus">
            <a href="/home">Home</a>

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

      <div className="historyMainContainer">
        {meetings.length > 0 ? (
          meetings.map((meeting , index) => (
            <div style={{padding:"20px" , borderBottom:"1px solid grey"}} key={meeting.meetingCode}>
              <p>
                <b>{meeting.user_id}</b>
              </p>
              <p>Date: {meeting.date}</p>
              <p>Meeting Code: <b>{meeting.meetingCode}</b></p>
            </div>
          ))
        ) : (
          <p>No meetings joined yet</p>
        )}
      </div>
    </div>
  );
}

export default WithAuth(History);
