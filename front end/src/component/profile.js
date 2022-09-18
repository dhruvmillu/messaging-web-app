import React, { useState, useEffect } from "react";
import logo from "./images/profile.jpg";
import Add_friends from "./addfriends";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./styles/profile.css";
import { Container,Row,Col, SplitButton, ButtonGroup, DropdownButton } from "react-bootstrap";
import { Link,useParams,useNavigate } from "react-router-dom";
import jwt from 'jsonwebtoken';
import moment from "moment";
import { Dropdown ,Button} from "react-bootstrap";

const Profile = ({type}) => {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [searchData, setSearch] = useState(null);
  const [data, setData] = useState(null);
  const [view, setView] = useState(0);
  const [rqStat,setRq] = useState(0)
  let param = useParams()
  console.log(param)
  function date(d) {
    var d1 = moment(d).format("D MMM, YY")
    return d1;
  }

  function display(message, type) {
    switch (type) {
      case "text":
        return (
          <p className="msg" style={{ whiteSpace: "pre-line" }}>
            {message}
          </p>
        );
      case "ani":
        console.log(message);
        return (
          <div className="saved">
            <div className="confirm-img">
              <img src={message.img} />
            </div>
            <div className="saved-text">
              <p>{message.name}</p>
            </div>
          </div>
        );
      case "ani-epi":
        return (
          <div className="saved">
            <div className="confirm-img">
              <img src={message.img} />
            </div>
            <div className="saved-text">
              <p>{message.name}</p>
              <p>
                {message.no}-{message.episode}
              </p>
            </div>
          </div>
        );
      case "manga":
        return (
          <div className="saved">
            <div className="confirm-img">
              <img src={message.img} />
            </div>
            <div className="saved-text">
              <p>{message.name}</p>
            </div>
          </div>
        );
      case "manga-ch":
        return (
          <div className="saved">
            <div className="confirm-img">
            {message.img.map((im,i) => (<div ><LazyLoadImage src={im} threshold="00" width="300px" key={i} style={{minHeight:"100px",height:"auto"}}/></div>))}
            </div>
            <div className="saved-text">
              <p>{message.name}</p>
              <p>Chapter - {message.ch}</p>
            </div>
          </div>
        );
      case "manga-pg":
        return (
          <div className="saved">
            <div className="confirm-img">
              <img src={message.img} />
            </div>
            <div className="saved-text">
              <p>{message.name}</p>
              <p>Chapter - {message.ch}</p>
              <p>Page - {message.page}</p>
            </div>
          </div>
        );
      case "image":
      case "nh":
      case "nh-pg":
    }
  }

  
  async function searchPeep(key){
    console.log(key);
    if(key.trim()!==""){
    const req = await fetch('http://localhost:1337/api/search', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        key,
      }),
    })


    const data = await req.json()
    setSearch(data.data)
    console.log(data)}
    else{
      setSearch(null);
    }
  }
  async function sendFR(){
      const key = data.username
      console.log(data.username)
      if(rqStat==0){
      const res = await fetch("http://localhost:1337/api/sendRequest",{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
          key
        })
      })
      const result = await res.json();
      console.log(result)}
      else{
        const res = await fetch("http://localhost:1337/api/deleteRequest",{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
          key
        })
      })
      const result = await res.json();
      console.log(result)}
  }
  
  async function getData() {
    const req = await fetch('http://localhost:1337/api/profile_self', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    })

    const data = await req.json()
    console.log(data)
    setData(data.data)
  }
  async function getOtherData(){
    const req = await fetch('http://localhost:1337/api/profile?username='+param.username)
    const data = await req.json();
    setData(data.data)
    const token= localStorage.getItem('token')
    let u = (jwt.decode(token)).username
    let r_list = data.data.requests
    for(let i =0;i<r_list.length;i++){
        if(r_list[i].username==u){
          setRq(-1)
        }
    }
    console.log(r_list[0],user);
  }

  async function ansRq(key,status){
      const res = await fetch("http://localhost:1337/api/Request",{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
          key,
          status
        })
      })
      const result = await res.json();
      console.log(result)
      if(result.satus=="ok"){
        let z = data
        for(let i=0;i<z.requests.length;){
          if(z.requests[i].username==key){
            z.requests.splice(i,1)

          }
          else{i++}
        }
        setData(z)
      }
  }

  useEffect(() => {},[searchData,rqStat])

  useEffect(() => {
    const token = localStorage.getItem('token')
    
      if(token){
        const user = jwt.decode(token)
        setUser(user.username)
        console.log(user);
        if(type=="self"){
        getData()}
        else{
          getOtherData()
        }
      }
      else{
        nav("../login")
      }
    
    console.log(token);
  }, []);
  return (
    <>
      {data && (
        <div style={{ color: "white" }}>
          <div className="profile-card">
            <img src={data.profile} />
            <div>
              <div className="info-view">
                <div
                  className="info-holder"
                  style={{ left: view * 1230 + "px" }}
                >
                  <div className="profileInfo">
                    <p>
                      <span>Username</span> : {data.username}
                    </p>
                    <p>
                      <span>Name</span> : {data.name}
                    </p>
                    <p>
                      <span>Email</span> : {data.email}
                    </p>
                    <p>
                      <span>DOB</span> : {date(data.dob)}
                    </p>
                    <p>
                      <span>Phone no</span> : {data.phone}
                    </p>
                  </div>
                  <div className="memberInfo">
                    <div>
                      <p>friends</p>
                      <div className="member-list">
                        {data.friends &&
                          data.friends.map((el, i) => (
                            <Link onClick={() => this.forceUpdate} to={el.username==user?"../view_profile/self":"../view_profile/friend/"+el.username}>
                          <div key={i} className="member-data" >
                            <img src={el.profile}/>
                            <p>{el.username}</p>
                          </div>
                          </Link>
                          ))}
                      </div>
                    </div>
                    <div>
                      <p>groups</p>
                      <div className="member-list">
                        {data.groups &&
                          data.groups.map((el, i) => (
                            <div key={i} className="member-data">
                              <img src={el.profile_pic} />
                              <p>{el.groupName}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="view-button-holder">
                <button
                  className="view-changer"
                  onClick={() => (view ? setView(0) : setView(-1))}
                >
                  <div style={{ top: view * 45 + "px" }}>
                    <p>show friends and groups</p>
                    <p>show personal info</p>
                  </div>
                </button>
                {type == "other" ? (
                  <button className="view-changer" onClick={() => {setRq(rqStat?0:-1)
                    sendFR()}}><div style={{ top: rqStat * 45 + "px" }}><p>send friend request</p><p>unsend request</p></div></button>
                ) : (
                  ""
                )}
                {type == "friend" ? (
                  <button className="view-changer">unfriend</button>
                ) : (
                  ""
                )}
                {type == "self" ? (
                  <button className="view-changer">edit information</button>
                ) : (
                  ""
                )}
                {type == "self" ? (
                  <button className="view-changer" onClick={() => {
                    localStorage.removeItem('token')
                    nav("../login")
                  }}>logout</button>
                ) : (
                  ""
                )}
              
                {type == "self" ? (
                  <DropdownButton
                  as={ButtonGroup}
                  id={`dropdown-button-drop-1`}
                  size="lg"
                  title="Media"
                  variant="light"
                >
                  <Dropdown.Item onClick={() => nav("../media/anime")}>Anime</Dropdown.Item>
                  <Dropdown.Item onClick={() => nav("../media/manga")}>Manga</Dropdown.Item>
                </DropdownButton>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>


          <Container>
          {
              type=="self"?
                <>
                  <Row>
              <Col xs={6}><div className="request-tab">
              <p className="list-heading">Requests</p>
              <div className="request-list">
                {data.requests &&
                  data.requests.map((el, i) => (
                    
                    <div key={i} className="member-data">
                      <Link to={"../view_profile/other/"+el.username}>
                        <div className="request-data">
                        <img src={el.profile} style={{width:"70px"}}/>
                        <p>{el.username}</p>
                        </div>
                      
                      </Link>
                      
                      <button onClick={()=> ansRq(el.username,"accept")}>accept</button>
                      <button onClick={()=> ansRq(el.username,"reject")}>reject</button>
                    </div>
                    
                  ))}
              </div>
            </div></Col>
              <Col>
                <div className="serach-person">
                <p className="list-heading">Add Friends</p>
                  <input className="person-search-bar" placeholder="search people or groups" onChange={(e)=>searchPeep(e.target.value)} />
                  <div className="person-list">{console.log(searchData)}
                      {
                        searchData && searchData.map((el,i) =>(
                          <Link to={"../view_profile/other/"+el.username}>
                          <div key={i} className="member-data">
                            <img src={el.profile}/>
                            <p>{el.username}</p>
                          </div>
                          </Link>
                        ))
                      }
                  </div>
                </div></Col>
            
            
            </Row>
            <Row>
              <Col>
              <div className="media-tab">
              <p className="list-heading">Bookmarked media</p>
              <div className="request-list">
                {data.bookmarks &&
                  data.bookmarks.map((el, i) => (
                    <div key={i} className="media-member-data">
                      {display(el.value, el.type)}
                    </div>
                  ))}
              </div>
            </div></Col>
            
            </Row>
                </>
                :
                <Row>
              
              <Col>
              <div className="media-tab">
              <p className="list-heading">Bookmarked media</p>
              <div className="request-list">
                {data.bookmarks &&
                  data.bookmarks.map((el, i) => (
                    <div key={i} className="media-member-data">
                      {display(el.value, el.type)}
                    </div>
                  ))}
              </div>
            </div></Col>
            
            </Row>
                
            }
            
            
            
          </Container>
        </div>
      )}
    </>
  );
};

export default Profile;
