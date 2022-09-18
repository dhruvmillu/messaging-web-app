import React, { useState, useEffect,useCallback } from "react";
import "./styles/attachment.css";
import nlogo from "./images/n.png";
import Search from "./search";
import Anime from "./searchComponent/anime";
import Manga from "./searchComponent/manga";
import ConfirmSend from "./searchComponent/confirmSend";
const Attachment = ({ user,callback }) => {
  const [attType, setAttType] = useState(null);
  const [data,setData] = useState(null)
  const getData = useCallback((obj) => {
    console.log(obj);
    setData(obj)
  },[])
  const getConfirm = useCallback((obj) => {
    if(obj){
      callback(obj)
    }
    else{
      setAttType("basic")
    }
  },[])
  useEffect(()=>{
    setData(null)
  },[attType])

  function openType() {
    if(data){ 
      return <ConfirmSend data={data} callback={getConfirm}/>
    }
    else
    switch (attType) {
      case "manga":
        return <Manga callback={getData}/>;
      case "anime":
        return <Anime callback={getData}/>;
      case "nHentai":
        return <Search />;
      default:
        return (
          <div>
            <button
              className="att-selector"
              onClick={() => setAttType("manga")}
            >
              <span className="material-icons">menu_book</span>
            </button>
            <button
              className="att-selector"
              onClick={() => setAttType("anime")}
            >
              <span className="material-icons">movie</span>
            </button>
            <button
              className="att-selector"
              onClick={() => setAttType("nhentai")}
            >
              <img src={nlogo} />
            </button>
            <button className="att-selector">
              <span className="material-icons">image</span>
            </button>
          </div>
        );
    }
  }
  return <><div className="att-container">{openType()}</div></>;
};
export default Attachment;
