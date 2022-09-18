import { useState,useCallback } from "react";
import Search from "./component/search";
import Messager from "./component/messager";
import Login from "./component/login";
import "./App.css";
import Register from "./component/register";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import { BrowserRouter as Router,Routes,Route, useNavigate, Navigate } from "react-router-dom";
import MangaCh from "./component/searchComponent/manga-ch";
import Show from "./component/searchComponent/animeSingle";
import Profile from "./component/profile";
import Add_friends from "./component/addfriends";
import Anime from "./component/searchComponent/anime";
import Manga from "./component/searchComponent/manga";
import { v4 } from "uuid";

function App() {
  const [key, setSearch] = useState(null);
  const [area, setArea] = useState("manga");
  const [anime,setAnime] =useState(null)
  const nav =useNavigate()
  return (
    <div className="App" style={{boxSizing:"border-box"}}>
       
        <Routes>
          <Route path="/" element={<Navigate to={localStorage.getItem("token")?"../messager":"../login"}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/messager" element={<Messager/>}/>
          <Route path="/view_profile/self" element={<Profile type="self" key={v4()}/>}/>
          <Route path="/view_profile/other/:username" element={<Profile type="other" key={v4()}/>}/>
          <Route path="/view_profile/friend/:username" element={<Profile type="friends" key={v4()}/>}/>
          <Route path="/media/anime" element = {<Anime type="book"/>}/>
          <Route path="/media/manga" element = {<Manga type="book"/>}/>
        </Routes>
      
      
    </div>
  );
}

export default App;