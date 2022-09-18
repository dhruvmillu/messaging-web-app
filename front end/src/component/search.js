import { useState } from "react";
import Manga from "./searchComponent/manga";
import NHentai from "./searchComponent/nhentai";
import Anime from "./searchComponent/anime";
import "./styles/search.css";
import "./searchComponent/profile.css"

function Search() {
  const [key, setSearch] = useState(null);
  const [area, setArea] = useState("manga");
  return (
    <div className="App">
      <input
        type="text"
        className="m-search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="searchState"
        onClick={(e) => setArea("manga")}
        style={{ background: area === "manga" ? "#d400ff" : "rgb(0, 0, 75)" }}
      >
        manga
      </button>
      <button
        className="searchState"
        onClick={(e) => setArea("anime")}
        style={{ background: area === "anime" ? "#d400ff" : "rgb(0, 0, 75)" }}
      >
        anime
      </button>
      <button
        className="searchState"
        onClick={(e) => setArea("hentai")}
        style={{ background: area === "hentai" ? "#d400ff" : "rgb(0, 0, 75)" }}
      >
        hentai
      </button>
      {area === "hentai" && <NHentai props={key} />}
      {area === "manga" && <Manga props={key} />}
      {area === "anime" && <Anime props={key} />}
    </div>
  );
}
export default Search;