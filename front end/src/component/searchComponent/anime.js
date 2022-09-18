import React, { useState, useEffect } from 'react';
import Show from './animeSingle';
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
const Anime= ({callback,type=""}) =>{
  const nav= useNavigate()
    const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([null]);
  const[Search,setSearch]=useState(null);
  const [selected,setSelected] = useState(null)
    async function search(){
        try{let result
            try{
            result = await fetch("https://api.jikan.moe/v3/search/anime?q="+Search)}
            catch(e){
                console.log(e)
            }
            let res = await result.json()
            console.log(res.results)
            setIsLoaded(true)
            return res.results
            }
        catch(e){
            setError(e.message)
        }
        
    }
    function fas() {
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else if (selected){
          {console.log(selected)}
          return <Show id={selected} callback={callback} type={type}/>
            
        } else {
          return (
            <ul>
              {items &&
                items.map((item, j) => (
                    item && (
                  <li key={item.mal_id} onClick={() => {
                    setSelected(item.mal_id) 
                  console.log(item.mal_id)}}>
                    {
                      <img
                        className="manga-img"
                        src={item.image_url}
                        alt={item.title}
                      />
                    }
                    <div style={{display:"block",width:"200%"}}>
                      <p className="">{item.title}</p>
                      <p className="manga-des">{item.synopsis}</p>
                    </div>
                  </li>)
                ))}
            </ul>
          );
        }
      }
    useEffect(() => {
      
        async function load(){
            setItems(await search())
        }
        if(Search !== null){
        if(Search && Search.length>2){
            load()
        }}

        
    },[Search])
    useEffect(()=>{
      const token = localStorage.getItem("token");
    if(token){
      const decoded = jwt.decode(token)
    }
    else{
      nav("../login")
    }
    },[])
    return(
      <>
      <input placeholder="search anime" type="text" className="search-media" onChange={(e) => {setSearch(e.target.value)
      setSelected(0)}}/>
        <div>{fas()}</div>
        </>
    );
}
export default Anime