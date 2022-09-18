import React, { useState, useEffect,useCallback } from "react";
import MangaView from "./manga-view";
import "./style/manga-ch.css";
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
const MangaCh = ({
  manga , callback,type=""}) => {
    const nav= useNavigate()
  const [selected, setSelected] = useState(null);
  const [dataInfo, setInfo] = useState(null);
  const [dataCh, setCh] = useState(null);
  const getData = useCallback((d) =>{
        callback(d)
  },[callback])




  async function load() {
    let tempRes = await fetch("https://api.mangadex.org/manga/" + manga[0]);
    let mangaInfo = await tempRes.json();
    console.log(mangaInfo);
    setInfo(mangaInfo)
    tempRes = await fetch(
      "https://api.mangadex.org/manga/" +
        manga[0] +
        "/aggregate?translatedLanguage[]=en"
    );
    let mangaChapterInfo = await tempRes.json();
    setCh(mangaChapterInfo);
  }






  function titles(item) {
    let title;
    try {
      if (
        typeof item.attributes.title != "undefined" &&
        typeof item.attributes.title.en != "undefined"
      ) {
        title = item.attributes.title.en;
      } else {
        title = item.attributes.altTitles[0].en;
      }
    } catch (e) {
      console.log(e);
    }
    return title;
  }




  function date(d) {
    var d1 = new Date(d);
    var n_date = new Intl.DateTimeFormat().format(d1);
    return n_date;
  }


  async function sendM(){
    if(type=="book"){
      const res = await fetch("http://localhost:1337/api/bookmark", {
        method:'POST',
        headers: {
          'x-access-token':localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            type:"manga",
            value:{name:titles(dataInfo.data),data:manga[0],img:manga[1]}
          }),
        });
        const d = await res.json()
    
        console.log(d)
    }
    else{
      callback({value:{name:titles(dataInfo.data),data:manga[0],img:manga[1]},type:"manga"})
    }
  }

  useEffect(() => {
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




  if (selected){return <MangaView selected={selected} callback={getData} Name={titles(dataInfo.data)} type={type}/>}
  else{
    return (
      <div style={{ color: "white",display:"block" }}>
        {dataInfo && (
          <div className="manga-info-container">
            <img src={manga[1]} />
            <div style={{display:"block"}}>
              <p>
                {titles(dataInfo.data)}{" "}
                <span className="material-icons share-button" onClick={() => sendM()}>share</span>
              </p>
              <p>{dataInfo.data.attributes.description.en}</p>
              <p>status - {dataInfo.data.attributes.status}</p>
              <p>Updated At - {date(dataInfo.data.attributes.updatedAt)}</p>
              <p>Content Rating - {dataInfo.data.attributes.contentRating}</p>
            </div>
          </div>
        )}
        {dataCh && (
          <div style={{display:"block"}}>
            {Object.keys(dataCh.volumes).map((el) => (
              <div key={el} className="volume" style={{display:"block"}}>
                <p>Volume - {dataCh.volumes[el].volume+"      "} </p>
                <div style={{display:"block",width:"100%"}}>
                  {Object.keys(dataCh.volumes[el].chapters)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((ch) => (
                      <div key={ch} className="chapter" onClick={() => setSelected(dataCh.volumes[el].chapters[ch].id)} style={{display:"block"}}>
                        <p>
                          Chapter - {dataCh.volumes[el].chapters[ch].chapter}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );}
};

export default MangaCh;
