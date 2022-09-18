import React, { useState, useEffect } from "react";
import "./styles/messager.css";
import { io } from "socket.io-client";
import profile from "./images/profile.jpg";
import Msg_Display from "./msg_dispay";
import { useNavigate } from "react-router-dom";
import  jwt  from "jsonwebtoken";
 const socket = io("http://127.0.0.1:5000/");
 let sid = socket.id
 socket.on("connect", () => {
   console.log("connected",socket.id);
 });
 socket.on("disconnect", () => console.log("disconnected"));

const Messager = () => {
  
  const nav = useNavigate()
  const [user, setUser] = useState(null);
  const [msgUser, setMUser] = useState(null);
  const [currRec, setCRec] = useState(null);
  const [user_list,setList] = useState(null)
  const [load,setLoad] = useState(false)
  const [profile,setP]= useState(null)
    
  //opens user chat
  function setCurrUser(e, id) {
    setCRec(id);
    setP(e)
   
  }

  async function loadList(){
      const res = await fetch("http://localhost:1337/api/msgList",{
        headers:{
          'x-access-token':localStorage.getItem("token")
        }
      })
      const data = await res.json()
      let friends = data.data.friends
      console.log(friends)
      if(data.data){
      setMUser(data.data.friends)
      setList(data.data.friends)
      }
      else{
        console.log(data)
      }
  }
   

  //set search field
  function search(field) {
    let regex = new RegExp(field, "gi");
    let z = [];
    user_list.map((ele) => {
      let log = ele.username.match(regex);
      if (log != null && typeof log != "undefined") {
        z = [...z, ele];
      }
    });
    console.log(z);
    setMUser(z);
  }
  
  useEffect(()=>{},[msgUser])
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
      const decoded = jwt.decode(token)
      setUser(decoded.username)
      document.title= decoded.username
      console.log(sid,"j")
      socket.emit("setUser", decoded.username, socket.id)
      loadList()
    }
    else{
      nav("../login")
    }
  },[])
  //adds media to document
  

  return (
    <>
      <div className="messager">
        {/* side menu */}

        <div className="side-menu">
          <div className="user-chat-search">
            <input
              type="text"
              className="chat-user-search"
              onChange={(e) => search(e.target.value)}
            />
            <span
              className="material-icons chat-user-search-btn"
              onClick={() => nav("../view_profile/self")}
            >
              account_circle
            </span>
          </div>
          <div className="content">
            <div className="display">
              {msgUser&&msgUser.length > 0 &&
                msgUser.map((ele, i) => (
                  <div
                    key={i}
                    id={ele.username}
                    className="chat-user-box"
                    onClick={(e) => setCurrUser(ele.profile, ele.username)}
                    style={{
                      backgroundColor:
                        currRec == ele.username ? "#272727" : "transparent",
                    }}
                  >
                    <img
                      src={ele.profile}
                      id={ele.username}
                      className="user-profile-img"
                    />
                    <p id={ele.username}>{ele.username}</p>
                    
                  </div>
                ))}
            </div>
          </div>
        </div>

        {currRec && <div><Msg_Display currRec={currRec} user={user} socket={socket} profile={profile}/></div>
          }
      </div>
    </>
  );
};

export default Messager;
