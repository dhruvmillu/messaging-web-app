import React, { useState, useEffect } from "react";
import "./animeSingle.css";
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
const Show = ({ id ,callback,type=""}) => {
  const nav= useNavigate()
  const [data, setData] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [episodePage, setEpPage] = useState(1);
  console.log(id);
  function date(d){
      var d1= new Date(d)
      var n_date= new Intl.DateTimeFormat().format(d1)
      return n_date
  }
  async function sendAnime(){
    if(type=="book"){
      
      const res = await fetch("http://localhost:1337/api/bookmark", {
        method:'POST',
        headers: {
          'x-access-token':localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            type:"ani",
            value:{id:id,name:data.title,img:data.image_url}
          }),
        });
        const d = await res.json()
    
        console.log(d)
    }
    else{
      callback({type:"ani",value:{id:id,name:data.title,img:data.image_url}})
    }
  }
  async function sendAniEpi(title,no){
    if(type=="book"){
      
      const res = await fetch("http://localhost:1337/api/bookmark", {
        method:'POST',
        headers: {
          'x-access-token':localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            type:"ani-epi",
            value:{id:id,name:data.title,img:data.image_url,episode:title,no:no}
          }),
        });
        const d = await res.json()
    
        console.log(d)
    }
    else{
      callback({type:"ani-epi",value:{id:id,name:data.title,img:data.image_url,episode:title,no:no}})
    }
      
  }
  async function resultReturn() {
    try {
      let result;
      try {
        result = await fetch("https://api.jikan.moe/v3/anime/" + id);
      } catch (e) {
        console.log(e);
      }
      let res = await result.json();
      console.log(res);
      setData(res);
    } catch (e) {
      console.log(e);
    }
    try {
      let result2;
      try {
        result2 = await fetch(
          "https://api.jikan.moe/v3/anime/" + id + "/episodes/" + episodePage
        );
      } catch (e) {
        console.log(e);
      }
      let res = await result2.json();
      console.log(res);
      setEpisodes(res);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(async () => {
    await resultReturn();
  }, [episodePage]);
  useEffect(()=>{
    const token = localStorage.getItem("token");
  if(token){
    const decoded = jwt.decode(token)
  }
  else{
    nav("../login")
  }
  },[])
  return (
    data && (
      <>
        <div className="anime-holder" style={type=="book"?{width:"100% ",color:"white"}:{color:"white"}}>
          <div className="anime-info" >
            <img src={data.image_url} className="anime-cover"/>
            <div>
              <p className="anime-title">{data.title}
                <span className="material-icons share-button" onClick={()=>sendAnime()}>share</span>
              </p>
              <p className="anime-synopsis"><b>Synopsis</b> - {data.synopsis}</p>
              <p className="anime-synopsis"><b>status </b>- {data.status}</p>
              <p className="anime-synopsis"><b>from</b> - {data.aired.string}</p>
              <p className="anime-synopsis"><b>duration</b> - {data.duration}</p>
            </div>
          </div>
          <div className="episode-container" >
          {episodes &&
            episodes.episodes.map((ep, i) => (
              <div key={ep.episode_id} className="episode-list" style={{display:"block"}}>
                <p>{ep.episode_id + "  " + ep.title}</p>
                <p><b>Aired on</b> - {ep.aired?date(ep.aired):"?"}</p>
                {ep.filler ? <p>filler</p> : ""}
                {ep.recap ? <p>recap</p> : ""}
                <span className="material-icons share-button" onClick={() => sendAniEpi(ep.title,ep.episode_id)}>share</span>
              </div>
            ))}
          </div>
          
            {episodes && (<div className="epi-nav-buttons"style={{alignSelf:"center"}}><button onClick={() => 1<episodePage?setEpPage(episodePage-1):""}>back</button> <button onClick={() => episodes.episodes_last_page>episodePage?setEpPage(episodePage+1):""}>forward</button></div>)}
        </div>
      </>
    )
  );
};

export default Show;
