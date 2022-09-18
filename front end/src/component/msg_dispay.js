import React, { useState, useEffect,useCallback,useRef } from 'react';
import "./styles/messager.css";
import Message from "./mesage";
import Attachment from "./attachment";

const Msg_Display = ({currRec,user,socket,profile}) => {
    const ref =useRef(null)
    const [att, setAtt] = useState(false);
    const [recieved, setRecieve] = useState("");
    const [msg, setMsg] = useState(null);
    const[self,setS] = useState(null)
    
    const c = currRec
    const getAttachment = useCallback( (data)=>{
        console.log(data)
        setVal(data)
        console.log(msg)
        setAtt(false)
    })
    function setVal(data){
      console.log(data)
      setMsg(data)
    }
    async function sendMsg(type,value){
        const res = await fetch('http://localhost:1337/api/send',{
          method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
          currRec,
          type,
          value
          
        })
        })
        const data = await res.json()
        console.log(data)
    }

    async function getImg(){
      const res = await fetch('http://localhost:1337/api/profile_img',{
          headers:{
            'x-access-token':localStorage.getItem('token')
          }
        })
        const data = await res.json()
        console.log(data.data.profile)
        setS(data.data.profile)
    }

    function send() {
      if(msg){
        console.log(msg);
        let z = [...recieved, { type:msg.type, message: msg.value, id: user,to:currRec }];
        console.log(z);
        setRecieve(z);
        sendMsg(msg.type,msg.value)
        socket.emit("message", msg, currRec, user);
        setMsg(null)
      }
        
      }

    //recieve messages
  function recieve() {
     socket.on("display", (r_msg) => {
       console.log(r_msg)
       setRecieve([...recieved, r_msg]);
     });
  }

    //sets height of input bar
    function setH(e) {
    let c = 20;
    e.target.style.height = c + "px";
    let h = Math.floor((e.target.scrollHeight - 30) / 20);
    e.target.style.height = (h * c)+30 + "px";
    setMsg({type:"text", value:e.target.value});
  }

    function handleBlur(event){
        // if(!event.currentTarget.contains(event.relatedTarget)){
        //    setAtt(false)
        //  }
      }
    async function loadMsg(){
        const res = await fetch('http://localhost:1337/api/messages?q='+currRec,{
          headers:{
            'x-access-token':localStorage.getItem('token')
          }
        })
        const data = await res.json()
        let l =data.data
        for(let i =0;i<data.data.length;i++){
          console.log(data.data[i].id)
          l[i].to=l[i].id==user?currRec:user
        }
        console.log(l)
        setRecieve(data.data)
    }

    

    useEffect(()=>{
      if(msg && msg.type!='text')
      send()
    },[msg])

    useEffect(()=>{
      loadMsg()
      getImg()
      console.log(user)
    },[currRec])

    useEffect(() => {
        recieve();
        
    }, [recieved.length]);

    return(<div className="m-box">
    <div className="m-head">
      <img src={profile} className="msg-profile-img" />
      <p>{currRec}</p>
    </div>
    <div className="m-display" style={{ pointerEvents: "auto" }}>
      {att && (
        <div className="attach" autoFocus onLoad={(e)=>e.target.parentElement.parentElement.parentElement.parentElement.focus()} tabIndex={0} onBlur={(e) => handleBlur(e)}>
          <Attachment callback={getAttachment}/>
        </div>
      ) }
      {
        
          
      }
      {recieved.length > 0 &&
        recieved.map((ms, i) =>
          (ms.to == currRec && ms.id == user) || (ms.id == currRec && ms.to == user)  ? (
          
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: ms.id == user ? "end" : "start",
              }}
            >
              <Message
                type={ms.type}
                username={ms.id}
                me={user}
                message={ms.message}
                profile={profile}
                self={self}
              />
            </div>
          ) : (
            ""
          )
          )}
    </div>
    <div className="m-input">
      <button
        className="m-btn attachment"
        onClick={() => {
          setAtt(true);
        }}
      >
        <span className="material-icons">add</span>
      </button>
      <textarea
        className="m-typer"
        onChange={(e) => setH(e)}
        rows={1}
        ref={ref}
        placeholder="Type Something Here"
      ></textarea>
      <button className="m-btn send" onClick={async () => {await send()
      ref.current.value=""
      }}>
        <span className="material-icons">send</span>
      </button>
    </div>
  </div>
)
}
export default Msg_Display;