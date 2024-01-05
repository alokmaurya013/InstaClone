import React, { useState, useEffect, useRef } from 'react';
const burl='https://instabackend-011h.onrender.com';
 
const ProfilePic = ({ changeProfile }) => {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("");

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "pandaClone")
    data.append("cloud_name", "pandashiv")
    fetch("https://api.cloudinary.com/v1_1/pandashiv/image/upload", {
      method: "post",
      body: data
    }).then(res => res.json())
      .then(data => setUrl(data.url))
      .then(err => console.log(err))
  }

  const postPic = () => {
    fetch(`${burl}/uploadProfilePic`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        pic: url
      })
    }).then(res => res.json())
      .then(data => {
        changeProfile();
        window.location.reload();
      })
      .catch(err => console.log(err))
  }
  const handleClick = () => {
    hiddenFileInput.current.click();
  }

  useEffect(() => {
    if (image) {
      postDetails();
    }
  }, [image])

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url])

  return (
    <div className='profilePic darkBg'>
      <div className='changePic centered'>
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className='upload-btn' style={{ color: "#1EA1F7" }}
            onClick={handleClick}>upload Photo</button>
          <input type='file' ref={hiddenFileInput} accept='image/*'
            style={{ display: "none" }}
            onChange={(e) => { setImage(e.target.files[0]) }} />
        </div>

        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className='upload_btn' style={{ color: "#ED4956" }}
            onClick={() => {
              setUrl(null)
              postPic()
            }}>
            Remove Current Photo</button>
        </div>

        <div style={{ borderTop: "1px solid #00000030" }}>
          <button style={{ background: 'none', border: "none", cursor: "pointer", fontSize: "15px" }}
            onClick={changeProfile}>cancel</button>
        </div>
      </div>
    </div>
  )
}
export default ProfilePic;
