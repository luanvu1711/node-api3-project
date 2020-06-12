const express = require('express')
const users = require("./userDb")
const posts = require("../posts/postDb")
const router = express.Router();

router.post('/users', validateUser(), (req, res) => {
  res.status(200).json(req.newUser)
});

router.post('/users/:id/posts', validatePost(), (req, res) => {
  res.status(200).json(req.newPost)
});

router.get('/users', (req, res, next) => {
  users.get()
  .then(user => {
    res.status(200).json(user)
  })
  .catch(next)
});

router.get('/users/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});

router.get('/users/:id/posts',validateUserId(), (req, res, next) => {
  users.getUserPosts(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(next)
});

router.delete('/users/:id', validateUserId(), (req, res, next) => {
  users.remove(req.params.id)
  .then(() => {
    res.status(200).json({
      message: "The user has been nuked"
    })
  })
  .catch(next)
});

router.put('/users/:id', validateUserId(), (req, res, next) => {
  if(!req.body.name){
    res.status(404).json({
      message: "Please enter the name"
    })
  } else {
    users.update(req.params.id, {name: req.body.name})
    .then(user => {
      res.status(200).json("You have updated the user")
    })
    .catch(next)
  }
});


//custom middleware

function validateUserId() {
  return (req, res, next) => {
    users.getById(req.params.id)
    .then(user => {
      if(user){
        req.user = user
        next()
      } else {
        res.status(404).json({
          message: "invalid user ID"
        })
      }  
    })
    .catch(next)
  }
}

function validateUser() {
  return (req,res,next) => {
    if(!req.body.name){
      return res.status(400).json({
        message:"missing user data"
      })
    } else {
      users.insert({ name: req.body.name})
      .then(user => {
        req.newUser = user
        next()
      })
      .catch(next)
    }
  }
}


function validatePost() {
  return (req, res, next) => {
    if(!req.body.text){
      res.status(400).json({
        message: "missing require text field in body"
      })
    } else {
      users.getById(req.params.id)
      .then(user =>{
        posts.insert({ text: req.body.text, user_id: req.params.id})
        .then(post =>{
          req.newPost = post
          next()
        })
      })
      .catch(next)
    }
  }
}

module.exports = router;
