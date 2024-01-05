import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import '../css/home.css';
const burl='https://instabackend-011h.onrender.com';
 
const Home = () => {
  var picLink = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F10%2F05%2F22%2F37%2Fblank-profile-picture-973460_640.png&tbnid=ScRGRFGMiXHWfM&vet=12ahUKEwi6mvKuj8OBAxUTfGwGHYOABpEQMygAegQIARBO..i&imgrefurl=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&docid=wg0CyFWNfK7o5M&w=640&h=640&q=blank%20picture&ved=2ahUKEwi6mvKuj8OBAxUTfGwGHYOABpEQMygAegQIARBO";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
 
  let limit = 10;
  let skip = 0;
  // const notifyA=(msg)=>toast.error(msg)
  const notifyB = (msg) => toast.success(msg);

    useEffect(()=>{
      const token=localStorage.getItem("jwt")
      if(!token){
        navigate("/");
      }
      fetch(`${burl}/allposts`,{
         headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
         }
      }).then(res=>res.json())
      .then(result=>{
        setData(result)
      }).catch(err=>{
        console.log(err);
      })
    },[])

  // useEffect(() => {
  //   const token = localStorage.getItem("jwt")
  //   if (!token) {
  //     navigate("./signup")
  //   }
  //   fetchPosts();
  //   window.addEventListener("scroll", handleScroll)
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   };
  // });

  // const fetchPosts = () => {
  //   fetch("/allposts", {
  //     headers: {
  //       "Authorization": "Bearer " + localStorage.getItem("jwt")
  //     }
  //   }).then(res => res.json())
  //     .then(result => {
  //      setData((data) => [...data, ...result])
  //     })
  //     .catch(err => console.log(err))
  // }

  // const handleScroll = () => {
  //   if (document.documentElement.clientHeight + window.pageYOffset >= document.documentElement.scrollHeight) {
  //     skip = skip + 10;
  //     fetchPosts();
  //   }
  // }

  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  }
  
  const likePost = (id) => {
    fetch(`${burl}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      }),
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          } else {
            return posts
          }
        })
        setData(newData);
      })
  }

  const unlikePost = (id) => {
    fetch(`${burl}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          } else {
            return posts
          }
        })
        setData(newData);
      });
  }

  const makeComment = (text, id) => {
    fetch(`${burl}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: text,
        postId: id
      })
    }).then(res => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result
          } else {
            return posts
          }
        })
        setData(newData);
        setComment("");
        notifyB("Comment posted");
      })
  }

  return (
    <div className='home'>
      {Array.isArray(data)&&data.map((posts) => {
        return (
          <div className='card'>
            <div className='card-header'>
              <div className='card-pic'>
                <img src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink} alt="" />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}</Link>
              </h5>
            </div>
            <div className="card-image">
              <img src={posts.photo} alt=" " />
            </div>
            <div className='card-content'>
              {
                posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
                  (<span className="material-symbols-outlined material-symbols-outlined-red"
                    onClick={() => unlikePost(posts._id)}>favorite</span>
                  ) :
                  (<span className="material-symbols-outlined"
                    onClick={() => { likePost(posts._id) }}>favorite</span>
                  )
              }
              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => { toggleComment(posts) }}>View all comment</p>
            </div>
            <div className='add-comment'>
              <span className="material-symbols-outlined">mood</span>
              <input type='text' placeholder='Add a comment' value={comment}
                onChange={(e) => { setComment(e.target.value) }} />
              <button className='comment'
                onClick={() => { makeComment(comment, posts._id) }}>Post</button>
            </div>
          </div>
        )
      })}

      {show && (<div className='showComment'>
        <div className='container'>
          <div className='postPic'>
            <img src={item.photo} alt='' />
          </div>
          <div className='details'>
            <div className='card-header' style={{ borderBottom: "1px solid #00000029" }}>
              <div className='card-pic'>
                <img src='' alt="" />
              </div>
              <h5>{item.postedBy.name}</h5>
            </div>
            <div className='comment-section' style={{ borderBottom: "1px solid #00000029" }}>
              {item.comments.map((comment) => {
                return (
                  <p className='comm'>
                    <span className='commenter' style={{ fontWeight: "bolder" }}>
                      {comment.postedBy.name}{" "}</span>
                    <span className='commentText'>{comment.comment}</span>
                  </p>
                )
              })}
            </div>
            <div className='card-content'>
              <p>{item.likes.lenght}Likes</p>
              <p>{item.body}</p>
            </div>
            <div className='add-comment'>
              <span className="material-symbols-outlined">mood</span>
              <input type='text' placeholder='Add a comment' value={comment}
                onChange={(e) => setComment(e.target.value)} />
              <button className='comment' onClick={() => {
                makeComment(comment, item._id);
                toggleComment();
              }}>Post</button>
            </div>
          </div>
        </div>
        <div className='close-comment' onClick={() => { toggleComment() }}>
          <span className='material-symbols-outlined material-symbols-outlined-comment'>
            close</span>
        </div>
      </div>)}
    </div>
  )
}
export default Home;
