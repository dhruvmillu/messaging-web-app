import React, { useState, useEffect } from "react";
import "./styles/message.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import icon from "./images/profile.jpg";
import jwt from "jsonwebtoken";
const Message = ({ message, type="text", username ,me,profile,self}) => {
    
    function display(){
      switch(type){
        case "text":
          return <p className="msg" style={{whiteSpace:"pre-line"}}>
          {message}
        </p>
        case "ani":
          console.log(message)
          return <div>
            <div className="confirm-img"><img src={message.img}/></div>
            <p>{message.name}</p>
            
          </div>
        case "ani-epi":
          return <div>
            <div className="confirm-img"><img src={message.img}/></div>
            <p>{message.name}</p>
            <p>{message.no}-{message.episode}</p>
          </div>
        case "manga":
          return <div>
            <div className="confirm-img"><img src={message.img}/></div>
            <p>{message.name}</p>
          </div>
        case "manga-ch":
          return <div>
            <div className="confirm-img">
              {message.img.map((im,i) => (<LazyLoadImage src={im} threshold="500" width="550px" key={i}/>))}
            </div>
            
            <p>{message.name}</p>
            <p>Chapter - {message.ch}</p>
          </div>
        case "manga-pg":
          return <div>
            <div className="confirm-img"><img src={message.img}/></div>
            
            <p>{message.name}</p>
            <p>Chapter - {message.ch}</p>
            <p>Page - {message.page}</p>
          </div>
        case "image":
        case "nh":
        case "nh-pg":

      }
    }

    

    useState(()=>{
      
      
    })
    

    
    if(username===me){
        return (
            <>
              <div className="message-b" >
                
                <div>
                  <p className="user" style={{textAlign:"end"}}>you</p>
                  {display()}
                </div>
                <img src={self?self:icon} className="msg-profile-img" style={{marginLeft: "20px"}}/>
              </div>
            </>
          );
    }
    return (
        <><div className="message-b" >
          <img src={profile?profile:icon} className="msg-profile-img" style={{marginRight: "20px"}}/>
            <div>
              <p>{username}</p>
                {display()}
            </div>
            
          </div>
        </>
      );
    
  }
;

export default Message;
