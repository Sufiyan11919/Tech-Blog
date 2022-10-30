const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { Comment } = require('../../models');

//route to get all the comments
router.get('/', (req, res) => {
    Comment.findAll()
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//route creates only if the user is logged in
router.post('/', withAuth, (req, res) => {
    Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id,
      post_id: req.body.post_id
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });

  // route to delete comment by id
  router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No comment found with this id!' });
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
  