import React, { useState, useEffect } from 'react';
import "./confirmSend.css";
import { LazyLoadImage } from 'react-lazy-load-image-component';
const ConfirmSend = ({data,callback}) =>{
    console.log(data)
    function type(){
        switch(data.type){
            case "ani": return <p>{data.value.name}</p>
            case "ani-epi" : return (<><p>{data.value.name}</p><p>{data.value.no+" - "+data.value.episode}</p></>)
            case "manga" :return(<><p>{data.value.name}</p></>)
            case "manga-ch" :return(<><p>{data.value.name}</p> <p>Chapter - {data.value.ch}</p> </>)
            case "manga-pg" :return(<><p>{data.value.name}</p> <p>Chapter - {data.value.ch}</p><p>Page - {data.value.page}</p> </>)
        }
    }
    return(
        <div className="confirm-container">
            <div className="confirm-img">
                {data.type=="manga-ch"? data.value.img.map((im,i) => (<LazyLoadImage src={im} threshold="500" width="550px" key={i}/>)):<img src={data.value.img}/>}
                
            </div> 
            <div>
                <div>
                    {type()} 
                </div>
                 
            <div>
                <button onClick={()=> callback(data)}> send</button>
            <button  onClick={()=> callback(false)}>cancel</button>
            </div>
            </div>
            
        </div>
    )

}

export default ConfirmSend