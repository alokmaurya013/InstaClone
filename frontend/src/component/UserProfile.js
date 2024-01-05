import React, { useEffect, useState } from 'react';
import '../css/profile.css';
import PostDetail from './PostDetail';
import { useParams } from 'react-router-dom';
const burl='https://instabackend-011h.onrender.com';
 
const UserProfile = () => {
  var picLink = "";
  const { userid } = useParams();
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [isFollow, setIsFollow] = useState(false);

  const followerUser = (userId) => {
    fetch(`${burl}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId
      })
    }).then((res) => res.json())
      .then((data) => {
        setIsFollow(true)
      })
  };

  const unfollowerUser = (userId) => {
    fetch(`${burl}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId
      })
    }).then((res) => res.json())
      .then((data) => {
        setIsFollow(false)
      });
  };

  useEffect(() => {
    fetch(`${burl}/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.post);
        if (result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)) {
          setIsFollow(true)
        }
      })
  }, [isFollow])

  return (
    <div className='profile'>
      <div className='profile-frame'>
        <div className='profile-pic'>
          <img src={user.Photo ? user.Photo : picLink} alt='' />
        </div>
        <div className='profile-data'>
          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
            <h1>{user.name}</h1>
            <button className='followBtn'
              onClick={() => {
                if (isFollow) {
                  unfollowerUser(user._id)
                } else {
                  followerUser(user._id)
                }
              }}
            >{isFollow ? "Unfollow" : "Follow"}</button>
          </div>
          <div className='profile-info' style={{ display: "flex" }}>
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>

      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />

      <div className='gallery'>
        {posts.map((pics) => {
          return <img key={pics._id} src={pics.photo} className='item'
            onClick={() => {
              //toggleDetails(pics)
            }}
            alt='' />
        })}
      </div>
      {/* {show&&<PostDetail item={posts} toggleDetails={toggleDetails}/> }  */}
    </div>
  )
}
export default UserProfile;