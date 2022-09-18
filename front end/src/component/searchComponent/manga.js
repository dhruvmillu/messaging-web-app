import React, { useState, useEffect} from "react";
import MangaCh from "./manga-ch";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
const Manga = ({callback,type=""}) => {
  const nav= useNavigate()
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([null]);
  const [search, setSearch] = useState(null);
  const [selected,setSelected] =useState(null)
  const [total,setTotal]=useState(null);
  const [cur,setCurr]=useState(0);

  async function manga() {
    try {
      let res = await fetch(
        "https://api.mangadex.org/manga?contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&offset="+(cur*10)+"&order[relevance]=desc&title=" +
          search +
          "&limit=10"
      );
      let result = await res.json();
      let z = result.data.map((id) => {
        return id.id;
      });
      console.log(result);
      setTotal(result.total/10)
      let url = "https://api.mangadex.org/cover?limit=100&";
      for (let k = 0; k < z.length; k++) {
        url += "manga[]=" + z[k] + "&";
      }
      url = url.substring(0, url.length - 1);
      let resC = await fetch(url).then(response => response.json());
      let itemEm = result.data;
      for (let i = 0; i < itemEm.length; i++) {
        for (let j = 0; j < resC.data.length; j++) {
          if (itemEm[i].id === resC.data[j].relationships[0].id) {
            itemEm[i].attributes["coverName"] =
              resC.data[j].attributes.fileName;
          }
        }
      }
      setIsLoaded(true);

      return itemEm;
    } catch (e) {
      setError(e);
    }
  }
  function fas() {
    if(selected)
      return <MangaCh manga={selected} callback={callback} type={type}/>
    else
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="mangaContainer">
        <ul>
          {items[0] != null &&
            items.map((item, j) => (
              <li key={item.id} onClick={()=> setSelected([item.id,"https://uploads.mangadex.org//covers/" +
              item.id +
              "/" +
              item.attributes.coverName])}>
                <LazyLoadComponent>
                {
                  <img
                    className="manga-img"
                    src={
                      "https://uploads.mangadex.org//covers/" +
                      item.id +
                      "/" +
                      item.attributes.coverName
                    }
                    alt={item.attributes.title.en}
                  />
                }
                <div>
                  <p className="">{titles(item)}</p>
                  <p className="manga-des">{item.attributes.description.en}</p>
                </div>
                </LazyLoadComponent>
                
              </li>
            ))}
        </ul>
        <div className="controlContainer"><button className="controls" onClick={() => 0<cur?setCurr(cur-1):""}> Previous</button><button className="controls" onClick={() => total-1>cur?setCurr(cur+1):""}>Next</button></div>
        </div>
      );
    }
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
  async function mloader() {
    setItems(await manga());
  }
  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    mloader();
    
  }, [search,cur]);
  useEffect(()=>{
    const token = localStorage.getItem("token");
  if(token){
    const decoded = jwt.decode(token)
  }
  else{
    nav("../login")
  }
  },[])
  return (<>
  {console.log(items)}
    <input placeholder="search manga" type="text" className="search-media" onChange={(e) => {setSearch(e.target.value)
      setSelected(0)}}/>
    <div className="mangalist" style={{ maxWidth: "100vw" }}>
      {fas()}
    </div>
    </>
  );
};

export default Manga;
