import React, { useState, useEffect, useRef } from "react";
import "./styles/register.css";
import pic from "./images/logo.jpeg";
import { ToastContainer, Toast } from "react-bootstrap";
import validate from "./validateRegister";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import update from "react-addons-update";
const Register = () => {
  const nav = useNavigate();
  const imClk = useRef(null);
  const [email, setEmail] = useState(null);
  const [profile, setProfile] = useState(pic);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [username, setUser] = useState(null);
  const [dob, seColob] = useState(null);
  const [password, setPass] = useState(null);
  const [rePass, seRowePass] = useState(null);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(null);
  function updateImage(uri) {
    encodeImageFileAsURL(uri);
  }

  async function sign_in() {
    const res = await fetch("http://localhost:1337/api/register", {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },  
    body: JSON.stringify({
        email,
        name,
        username,
        phone,
        dob,
        password,
        profile,
      }),
    });
    const data = await res.json()

    console.log(data)
  }

  useEffect(()=>{
    document.title="Register"
  })

  function checkVal(e) {
    e.preventDefault();
    const { submitVal, errors } = validate({
      email,
      username,
      phone,
      dob,
      password,
      rePass,
      name,
    });
    setError(errors);
    setShow(Array(errors.length).fill(true));
    if (submitVal) {
      sign_in();
      alert("Account Succesfull Created");
      nav("../login");
    }
  }
  function encodeImageFileAsURL(element) {
    var file = element[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log("RESULT", reader.result);
      setProfile(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        className="d-flex flex-column align-items-center"
        style={{ zIndex: "100000", maxHeight: "400px" }}
      >
        {error &&
          error.map((err, i) => (
            <Toast
              key={i}
              show={show[i]}
              bg="danger"
              onClose={() => setShow(update(show, { [i]: { $set: false } }))}
              style={{ width: "max-content" }}
            >
              <Toast.Header style={{ backgroundColor: "#f8d7d" }}>
                {" "}
                <div
                  className="me-auto"
                  style={{ color: "black", fontWeight: "500" }}
                >
                  Error
                </div>
              </Toast.Header>
              <Toast.Body>
                {" "}
                <div
                  className="d-flex flex-column justify-content-around align-content-baseline"
                  style={{ color: "#ffd4d4", fontSize: "15px" }}
                >
                  {err.map((er, j) => (
                    <p key={j} style={{ marginRight: "20px" }}>
                      {er}
                    </p>
                  ))}
                </div>
              </Toast.Body>
            </Toast>
          ))}
      </ToastContainer>
      <div className="form-holder">
        <form action="">
          <div>
            <img src={profile} className="addProfilePic" />
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log(imClk);
                imClk.current.click();
              }}
              className="picAdder"
            >
              <span className="material-icons">add</span>
            </button>
          </div>

          <input
            className="register-input"
            type="file"
            ref={imClk}
            placeholder="add profile pic"
            accept="image/png,image/jpg,image/gif"
            onChange={(e) => updateImage(e.target.files)}
          />
          <Container>
            <Row className="justify-content-center">
              <Col className="label" sm={{ span: 3 }}>
                Email
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="email"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                Name
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                Username
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="text"
                  placeholder="username"
                  onChange={(e) => setUser(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                Phone no
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="text"
                  placeholder="phone Number"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                date of birth
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="date"
                  placeholder="enter age"
                  onChange={(e) => seColob(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                password
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="password"
                  placeholder="type password"
                  onChange={(e) => setPass(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col className="label" sm={{ span: 3 }}>
                re-type password
              </Col>
              <Col sm={6}>
                <input
                  className="register-input"
                  type="password"
                  placeholder="re type password"
                  onChange={(e) => seRowePass(e.target.value)}
                />
              </Col>
            </Row>
          </Container>
          <input
            className="register-input"
            type="submit"
            value="register"
            onClick={(e) => checkVal(e)}
          />
          <input
            className="register-input"
            type="submit"
            value=" go to login"
            style={{height:"45px",padding:"0px",width:"190px",margin:"10px"}}
            onClick={(e) => {e.preventDefault()
            nav("../login")}}
          />
        </form>
      </div>
    </>
  );
};
export default Register;
