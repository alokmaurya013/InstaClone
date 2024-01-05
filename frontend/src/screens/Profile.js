import React, { useEffect, useState } from 'react';
import '../css/profile.css';
import PostDetail from '../component/PostDetail';
import ProfilePic from '../component/ProfilePic';
const burl='https://instabackend-011h.onrender.com';

const Profile = () => {
  var picLink = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3AXdxePoT9cB85WCfpKMScGpmmSTzOAM9knvcjxQ4&s"

  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([])
  const [changePic, setChangePic] = useState(false);
  const [user, setUser] = useState("");

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  }

  const changeProfile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`${burl}/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then((res) => res.json())
      .then((data) => {
        setPic(data.post)
        setUser(data.user)
      })
  }, [])

  return (
    <div className='profile'>
      <div className='profile-frame'>
        <div className='profile-pic'>
          <img onClick={changeProfile}
            src={user.Photo ? user.Photo : picLink} alt='' />
        </div>
        <div className='profile-data'>
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className='profile-info' style={{ display: "flex" }}>
            <p>{pic ? pic.length : "0"} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />

      <div className='gallery'>
        {pic.map((pics) => {
          return <img key={pics._id} src={pics.photo} className='item'
            onClick={() => {
              toggleDetails(pics)
            }}
             alt='' />
             
        })}
      </div>
       {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
       {changePic && <ProfilePic changeProfile={changeProfile} />} 
    </div>
  )
}
export default Profile;