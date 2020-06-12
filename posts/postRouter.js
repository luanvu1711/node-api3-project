const express = require('express');
const users = require("../users/userDb")
const posts = require("./postDb")
const router = express.Router();

router.get('/posts', (req, res) => {
  posts.get()
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: "Could not get posts"
    })
  })
});

router.get('/posts/:id', validatePostId(), (req, res) => {
  res.status(200).json(req.newPost)
});

router.delete('/posts/:id', validatePostId(),(req, res) => {
  posts.remove(req.params.id)
  .then(() => {
    res.status(200).json("The post has been nuked")
  })
  .catch(err => {
    res.status(500).json({
      message: "Couldnt delete the post"
    })
  })
});

router.put('/posts/:id', validatePostId(), (req, res) => {
  if(!req.body.text){
    res.status(404).json({
      message: "Please enter the post to update"
    })
  } else {
    posts.update(req.params.id, {text: req.body.text})
    .then(() => {
      res.status(200).json("The post has been updated")
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Couldn't update the post, please try later"
      })
    })
  }
});

// custom middleware

function validatePostId() {
  // do your magic!
  return (req, res, next) => {
    posts.getById(req.params.id)
    .then(post => {
      if(post){
        req.newPost = post
        next()
      } else {
        res.status(404).json({
          message: "Invalid post ID"
        })
      }
    })
    .catch(next)
  }
}

module.exports = router;
