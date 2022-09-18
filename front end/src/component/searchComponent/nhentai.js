import React, { useState, useEffect } from "react";
const NHentai = ({ props }) => {
  const [res, setRes] = useState(null);
  const [isLoaded, setLoad] = useState(false);
  const [pg, setPg] = useState(1);
  async function load() {
    let res = await fetch("https://h.api.rayriffy.com/v1/gallery/" + props);
    let result = await res.json();
    console.log(result);
    setRes(result.response.data);
  }
  useEffect(() => {
    load();
    setLoad(false);
    setPg(1);
  }, [props]);

  return (
    <div>
      <div>
        {res && (
          <>
            <h2 className="manga-titles">{res.title && res.title.english}</h2>
            <h3 className="pg-track">
              {res.images && pg + "/" + res.images.pages.length}
            </h3>
            <div className="viewer">
              <button
                className="controls pre" 
                onClick={() => pg > 1 && setPg(pg - 1) && setLoad(false)}
              >
                previous
              </button>
              <img
                className="nh-panel"
                src={
                  "http://localhost:3002/galleries/" +
                  res.media_id +
                  "/" +
                  pg +
                  ".jpg"
                }
                onLoad={(e) => setLoad(true)}
                style={{ visibility: isLoaded ? "visible" : "hidden" }}
              />
              <button
                className="controls next"
                onClick={() =>
                  pg <= res.images.pages.length &&
                  setPg(pg + 1) &&
                  setLoad(false)
                }
              >
                next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NHentai;
