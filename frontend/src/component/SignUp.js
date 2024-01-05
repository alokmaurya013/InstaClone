import React, { useState, useContext } from 'react'
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import '../css/SignUp.css';
import { toast } from "react-toastify"
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { LoginContext } from '../context/LoginContext';
const burl='https://instabackend-011h.onrender.com';
 
const SignUp = () => {
  const { setUserLogin } = useContext(LoginContext);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const notifyA = ((msg) => { toast.error(msg) })
  const notifyB = ((msg) => { toast.success(msg) })

  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("Invalid Email");
      return;
    } else if (!passRegex.test(password)) {
      notifyA("Password must contain at least 8 characters,including numaric and lowercase and uppercase letters and special characters for example")
      return;
    }
    
    fetch(`${burl}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        username: username,
        password: password
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
        console.log(data);
      })
  }
  const continueWithGoogle = (credentialResponse) => {
    const jwtDetail = jwt_decode(credentialResponse.credential)
    fetch(`${burl}/googleLogin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: jwtDetail.name,
        username: jwtDetail.name,
        email: jwtDetail.email,
        email_verified: jwtDetail.email_verified,
        clientId: credentialResponse.clientId,
        Photo: jwtDetail.picture
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed In successfully")
          localStorage.setItem("jwt", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setUserLogin(true)
          navigate("/")
        }
      })
  }
  return (
    <div className='signUp'>
      <div className='form-container'>
        <div className='form'>
          <img className='signUpLogo' src={logo} alt="" />
          <p className='loginPara'>Signup to see photos and videos <br /> from your friends</p>
          <div>
            <input type="email" name='email' id="email" value={email} placeholder='Email' onChange={(e) => {
              setEmail(e.target.value)
            }} />
          </div>
          <div>
            <input type="text" name='name' id="name" value={name} placeholder='Full Name'
              onChange={(e) => { setName(e.target.value) }} />
          </div>
          <div>
            <input type="text" name='username' id="username" value={username} placeholder='Username'
              onChange={(e) => { setUsername(e.target.value) }} />
          </div>
          <div>
            <input type="password" name='password' id="password" value={password} placeholder='Enter your password'
              onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <p className="loginPara" style={{ fontSize: "12px", margin: "3px 0px" }}>
            By signing up,you agree to our Terms,<br />privacy policy and cookies policy
          </p>
          <input type='submit' id='submit-btn' value="Sign Up" onClick={() => { postData() }} />
          <hr />
          <GoogleLogin onSuccess={credentialResponse => {
            continueWithGoogle(credentialResponse);
          }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
        <div className='form2'>
          Already have an account?
          <Link to="/signin"><span style={{ color: "blue", cursor: "pointer" }}>Sign In</span> </Link>
        </div>
      </div>
    </div>
  )
}
export default SignUp