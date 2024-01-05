import React, { useContext } from 'react';
import "../css/Navbar.css";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from '../context/LoginContext';
const burl='https://instabackend-011h.onrender.com';
 
const Navbar = ({ login }) => {
  const { setModalOpen } = useContext(LoginContext);
  const navigate = useNavigate();

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to="/profile"><li>Profile</li></Link>
          <Link to="/createPost"><li>Createpost</li></Link>
          <Link style={{ marginLeft: "20px" }} to='/followingpost'>My Following </Link>
          <Link to={""}>
            <button className='primaryBtn' onClick={() => setModalOpen(true)}
            >LogOut</button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signin"><li>SignIn</li></Link>
          <Link to="/signup"><li>SignUp</li></Link>
        </>,
      ];
    }
  };

  const loginStatusMobile = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return [
        <>
          <Link to="/"><li>
            <span className="material-symbols-outlined">home</span>
          </li></Link>
          <Link to="/profile">
            <li>
              <span className='material-symbols-outlined'>account_circle</span>
            </li></Link>
          <Link to="/createPost">
            <li><span className='material-symbols-outlined'>add_box</span>
            </li></Link>
          <Link to="/followingPost" style={{ marginLeft: "20px" }}>
            <li>
              <span className='material-symbols-outlied'>explore</span>
            </li>
          </Link>
          <Link to="/">
            <button className='primaryBtn' onClick={() => setModalOpen(true)}>LogOut</button>
          </Link>
        </>
      ]
    } else {
      return [
        <>
          <Link to="/signin"><li>SignIn</li></Link>
          <Link to="/signup"><li>SignUp</li></Link>
        </>,
      ];
    }
  }

  return (
    <div className="navbar">
      <img src={logo} alt="" onClick={() => { navigate("/") }} />
      <ul className='nav-menu'>
        {loginStatus()}
      </ul>
      <ul className='nav-mobile'>
        {loginStatusMobile()}
      </ul>
    </div>
  )
}
export default Navbar;
