import React, { useState, useEffect } from "react";
import "./styles/login.css";
import validateLogin from "./validateLogin";
import icon from "./images/logo.jpeg";
import { ToastContainer, Toast } from "react-bootstrap";
import update from "react-addons-update";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [errors, setErrors] = useState([]);
  const [show, setShow] = useState(null);
  const nav = useNavigate();
  async function login() {
    const res = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();

    console.log(data);
    if (data.user) {
      localStorage.setItem("token", data.user);
      nav("../messager");
    } else {
      setErrors([...errors, "please check login credentials"]);
    }
  }
  function validate(e) {
    e.preventDefault();
    var Errors = validateLogin({ email, password });
    setShow(Array(Errors.length).fill(true));
    setErrors(Errors);
    console.log(show);
    if (Errors.length == 0) {
      setErrors([]);
      login();
    }
  }
  function fas(i) {
    var z = errors;
    var j =0;
    while(j<z.length){
      if(z[j]== i){
        z.splice(j,1)
      }
      else{
        i++
      }
    }
    console.log(z);
    setErrors(z);
  }
  useEffect(() => {
    console.log(show);
    document.title=("Login")
  });
  return (
    <>
      <div>
        <ToastContainer
          position="top-center"
          className="d-flex flex-column align-items-center"
          style={{ zIndex: "100000" }}
        >
          {errors &&
            errors.map((err, i) => (
              <Toast
                key={i}
                show={show[i]}
                bg="danger"
                onClose={() => {setShow(update(show, { [i]: { $set: false } }))
                                fas(errors[i])}}
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
                    className="d-flex justify-content-around align-content-baseline"
                    style={{ color: "#ffd4d4", fontSize: "15px" }}
                  >
                    <span style={{ marginRight: "20px" }}>{err}</span>
                  </div>
                </Toast.Body>
              </Toast>
            ))}
        </ToastContainer>
        <form className="login-form">
          <img src={icon} />
          <input
            className="login-input"
            type="text"
            placeholder="Email"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <input
            className="login-input"
            type="submit"
            value="Login"
            onClick={(e) => validate(e)}
          />
          <button className="login-input" style={{height:"40px",padding:"0px",width:"190px",margin:"10px"}} onClick={(e)=>{e.preventDefault()
          nav("../register")}}>create account</button>
        </form>
      </div>
    </>
  );
};
export default Login;
