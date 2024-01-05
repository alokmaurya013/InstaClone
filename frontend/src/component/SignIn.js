import React, { useState, useContext } from 'react';
import "../css/SignIn.css";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom"
import { LoginContext } from '../context/LoginContext';
import { toast } from 'react-toastify';
const burl='https://instabackend-011h.onrender.com';
 
const SignIn = () => {
  const { setUserLogin } = useContext(LoginContext)
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const notifyA = ((msg) => { toast.error(msg) })
  const notifyB = ((msg) => { toast.success(msg) })
  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    fetch(`${burl}/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error)
        } else {
          notifyB("Signed in successfully")
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/")
        }
      })
  }
  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <img className='signUpLogo' src={logo} alt="" />
          <div>
            <input type='email' name='email' id="email" value={email} placeholder='email'
              onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div>
            <input type="password" name='password' id="password" value={password} placeholder='Password' onChange={(e) => {
              setPassword(e.target.value)
            }} />
          </div>
          <input type='submit' id="login-btn" value="Sign In"
            onClick={() => { postData() }} />
        </div>
        <div className='loginForm2'>
          Don't have an account?
          <Link to="/signup"><span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
export default SignIn