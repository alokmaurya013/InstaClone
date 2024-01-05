const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const POST = mongoose.model("POST")

router.get('/allposts', requireLogin, (req, res) => {
  let limit = req.query.limit
  let skip = req.query.skip
  POST.find()
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name")
    //.skip(parseInt(skip))
    //.limit(parseInt(limit))
    .sort("-createdAt",)
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})
router.post('/createPost', requireLogin, (req, res) => {
  const { body, pic } = req.body;
  if (!body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  const post = new POST({
    body,
    photo: pic,
    postedBy: req.user
  })
  post.save().then((result) => {
    return res.json({ post: result })
  }).catch(e => { console.log(e) });
})

router.get("/myposts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(myposts => { res.json(myposts) })
})

router.put("/like", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
  }, {
    new: true
  }).populate("postedBy", "_id name Photo")
    .then((result) => {
      res.json(result)
    }).catch((err) => {
      return res.status(422).json({ error: err })
    })
})

router.put("/unlike", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(req.body.postId, {
    $pull: { likes: req.user._id }
  }, {
    new: true
  }).populate("postedBy", "_id name Photo")
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      return res.status(422).json({ error: err })

    })
})
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id
  }
  POST.findByIdAndUpdate(req.body.postId, {
    $push: { comments: comment }
  }, {
    new: true
  }).populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name Photo")
    .then((result) => {
      res.json(result)
    }).catch((err) => {
      return res.status(422).json({ error: err })
    })
})

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  POST.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .then((pos) => {
      if(pos.postedBy._id.toString() == req.user._id.toString()) {
        pos.deleteOne()
           .then(result => {
              return res.json({ message: "Successfully deleted" })
            }).catch((err) => {
                console.log(err);
            })
      }
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    })
})

router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(posts => {
      res.json(posts)
    })
    .catch(err => { console.log(err) })

})
module.exports = router
