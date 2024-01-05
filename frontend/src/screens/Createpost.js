import React, { useState, useEffect } from 'react';
import '../css/CreatePost.css';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const burl='https://instabackend-011h.onrender.com';

const Createpost = () => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)
 
  useEffect(() => {
    if (url) {
      fetch(`${burl}/createPost`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          body,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            notifyA(data.error)
          } else {
            notifyB("Successfully posted")
            navigate("/")
          }
        })
        .catch(err => console.log(err))
    }
  }, [url])
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset", "pandaClone")
    data.append("cloud_name", "pandashiv")
    fetch("https://api.cloudinary.com/v1_1/pandashiv/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(data => setUrl(data.url))
      .then(err => console.log(err))
  }
  const loadfile = (e) => {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src)
    }
  }
  return (
    <div className='createPost'>
      <div className='post-header'>
        <h4 style={{ margin: "3px auto" }}>Create new post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
      </div>
      <div className='main-div'>
        <img id="output" src='' alt='' />
        <input type='file' accept='image/*' onChange={(e) => {
          loadfile(e);
          setImage(e.target.files[0])
        }} />
      </div>
      <div className='details'>
        <div className='card-header'>
          <div className='card-pic'>
            <img src='' alt='' />
          </div>
          <h5>Ramesh</h5>
        </div>
        <textarea value={body}
          onChange={(e) => { setBody(e.target.value) }}
          type="text" placeholder='write a caption...'></textarea>
      </div>
    </div>
  )
}
export default Createpost;