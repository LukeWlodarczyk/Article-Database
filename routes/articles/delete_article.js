const express = require('express');
const router = express.Router();

//Article Model
let Article = require('../../models/article');


//Delete article
router.delete('/:id', (req, res) => {
  if(!req.user._id) {
    res.status(500).send();
  };

  let query = {_id:req.params.id};

  Article.findById(req.params.id, (err, article) => {
    if(article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, err => {
        if(err) {
          console.log(err);
        };
        res.send('Succes')
      });
    };
  });
});


module.exports = router;
