const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// route to get all the users for Posts
router.get('/', (req, res) => {
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
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// route to get a user for Post with the help of id

router.get('/:id', (req, res) => {
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
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


// Route to create a post only if the user is logged in

router.post('/', withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// Route to update a Post if the user is logged in
router.put('/:id', withAuth, (req, res) => {
    Post.update(
    {
        where: {
        id: req.params.id
        }
    },
    {
        title: req.body.title,
        post_text: req.body.post_text
    },
    )
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }); 

// delet a post 
router.delete('/:id', withAuth, (req, res) => {
    console.log('id', req.params.id);
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(data);
      })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  module.exports = router;