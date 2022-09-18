async function cover(){ items.map(async (item)=>{
            let i=0
          for(;item.relationship[i].type!=="cover_art";i++){}
  
          let res=await fetch("https://api.mangadex.org/cover/"+item.relationship[i].id)
          let result=await res.json();
          console.log(result.data,"mj")
        })}