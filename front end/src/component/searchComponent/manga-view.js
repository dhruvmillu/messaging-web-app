import React, { useState, useEffect } from "react";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import "./style/manga-view.css"
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
const MangaView = ({ selected,callback,Name,type="" }) => {
  const nav= useNavigate()
  const [link, setLink] = useState(null);
  const [data, setData] = useState(null);
  const [chInfo, setInfo] = useState(null);
  async function getData() {
    let temp = await fetch("https://api.mangadex.org/chapter/" + selected);
    let res = await temp.json();
    console.log(res);
    setInfo(res.data);
    setLink(
      "https://uploads.mangadex.org/data/" + res.data.attributes.hash + "/"
    );
    setData(res.data.attributes.data);
  }
  async function sendCh(){
    if(type=="book"){
      const res = await fetch("http://localhost:1337/api/bookmark", {
        method:'POST',
        headers: {
          'x-access-token':localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            type:"manga-ch",
            value:{src:selected,img:data.map(im => {return(link+im)}),ch:chInfo.attributes.chapter,name:Name}
          }),
        });
        const d = await res.json()
    
        console.log(d)
    }
    else{
      callback({value:{src:selected,img:data.map(im => {return(link+im)}),ch:chInfo.attributes.chapter,name:Name},type:"manga-ch"})
    }
  }
  async function sendPg(val){
    if(type=="book"){
      const res = await fetch("http://localhost:1337/api/bookmark", {
        method:'POST',
        headers: {
          'x-access-token':localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            type:"manga-pg",
            value:val
          }),
        });
        const d = await res.json()
    
        console.log(d)
    }
    else{
      callback({value:val,type:"manga-pg"})
    }
  }
  useEffect(() => {
    async function load() {
      getData();
    }
    load();
  }, []);
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
    <div style={{ color: "white" }} className="view-container">
      <span>
        Chapter -{" "}
        {chInfo && chInfo.attributes.chapter + " : " + chInfo.attributes.title} <span className="material-icons share-button" onClick={() => sendCh()}>share</span>
      </span>
      <div>
        {data &&
          data.map((im, i) => (
            <div key={i} onClick={() => sendPg({src:selected,ch:chInfo.attributes.chapter,link:link,img:link + im,data:data,page:i,name:Name})} className="mangaImg">
              <LazyLoadImage src={link + im} threshold="500" width="550px"/>
            </div>
          ))}
          {console.log(data)}
      </div>
    </div>
  );
};

export default trackWindowScroll(MangaView);
