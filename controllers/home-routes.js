const router = require("express").Router()
const { response } = require("express");
const sequelize = require('../config/connection')
const Post = require("../models");
const user = require("../models");
const Comment = require("../models");

//route for getting all the "Post" for homepage
 router.get("/", (request,response)=>{
    Post.findAll({
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at'
          ],
          include: [
            {
            model: User,
            attributes: ['username']
            },
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
          ]
    })

    .then(data=>{
        const posts = data.map(post=> post.get({
            plain:true
        }))
        response.render("homepage",{
            posts,
            loggedIn: request.session.loggedIn
        })
    .catch(err =>{
        console.log(err);
        response.status(500).json(err);
    })
    })
 });

 //for one single post

 router.get("/post/:id", (request,response)=>{
    Post.findOne({
        where: {
            id: req.params.id
          },
          attributes: [
            'id',
            'post_text',
            'title',
            'created_at'
          ],
          include: [
            {
            model: User,
            attributes: ['username']
            },
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
          ]
    })
    .then(data => {
        if (!data) {
          respose.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        const post = data.get({ plain: true });
  
        response.render('single-post', {
          post,
          loggedIn: request.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        response.status(500).json(err);
      });
 })

 router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });
  
  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
  
    res.render('signup');
  });
  
  
  module.exports = router;