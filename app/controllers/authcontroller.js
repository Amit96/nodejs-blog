var exports = module.exports = {}
var models = require("./../models");

var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

exports.signup = function(req, res) {

    res.render('signup', {
      c: 2,

    });
}

exports.signin = function(req, res) {

    res.render('signin', {
      c: 1
    });

}

exports.dashboard = function(req, res) {
    res.render('dashboard', {
      logout_button: true
    });

}

exports.story = function(req, res) {
  models.comments.findAll({
      where: {
        pcid: null,
      }
  }).then(async function(comments) {
    var username = "";

    comment_string = '';
    for(var i = 0; i < comments.length; i++) {

      let user;
      try {
        user = await models.user.findById(comments[i].dataValues.user_id);

      } catch (err) {
        logger.error('Mysql error', err)
        return res.status(500).send()
      }

      comment_string = comment_string + '<div class="row" id="' + comments[i].dataValues.cid + '"><div class="col-md-10" id = "replyadd-' + comments[i].dataValues.cid + '"><p><a class="float-left" href="#"><strong>' + user.dataValues.firstname +
      '</strong></a><span class="float-right"></span><span class="float-right"></span><span class="float-right"></span><span class="float-right"></span></p><div class="clearfix"></div><p>' + comments[i].dataValues.comment +
      '</p><p id = "replyaddp-' + comments[i].dataValues.cid + '"><a class="float-right btn btn-outline-primary ml-2" onclick = "reply_box(this, 1)"> <i class="fa fa-reply"></i> Reply</a>';
      if(req.isAuthenticated() && comments[i].dataValues.user_id == req.user.id) {
        comment_string = comment_string + '<a class="float-right btn btn-outline-primary ml-2" onclick = "delete_comment(this,1)"> <i class="fa fa-chevron-circle-down"></i> <span id = "delete-' + comments[i].dataValues.cid + '">Delete</span></a>';

      }
      if(comments[i].dataValues.replies_exist == '1') {
        comment_string = comment_string + '<a class="float-right btn btn-outline-primary ml-2" onclick = "view_replies(this,1)"> <i class="fa fa-chevron-circle-down"></i> <span id = "view-' + comments[i].dataValues.cid + '">View Replies</span></a></p></div></div>';
      }
      else {
        comment_string += '</p></div></div>';

      }
    }
    var logout_button = false;
    if(req.isAuthenticated()) {
      logout_button = true;
    }
    res.render('story', {
        c: 0,
        id : req.query.id,
        comments: comment_string,
        logout_button,
    });

  }).catch(function(error) {
    console.log(error);
  });



}

exports.saveComment = async function(req, res) {
  if(req.isAuthenticated()) {
    var comment = req.body.comment;
    var story_id = req.body.story_id;
    var user_id = req.user.id;
    var reply, pcid;
    if(req.body.reply == "-1") {
      reply = 0;
      pcid = null;
    }
    else if(req.body.reply == "1") {
      reply = 1;
      pcid = req.body.pcid;
    }

    var data = {
      pcid: pcid,
      comment: comment,
      user_id: user_id,
      story_id: story_id,
      replies_exist: -1
    }
    if(pcid!=null) {
      var parent;
      try {
        parent = await models.comments.findById(pcid);

      } catch (err) {
        logger.error('Mysql error', err)
        return res.status(500).send()
      }
    }
    else {
      parent = null;
    }
    console.log(parent);
    models.comments.create(data).then(function(newComment, created) {
       if (!newComment) {
          res.send(false);
      }

      if (newComment) {
          sequelize.query("UPDATE comments SET replies_exist = 1 WHERE cid = " + pcid).then(function(newParent) {
            //res.send(newComment);
            sequelize.query("SELECT users.firstname, comments.updatedAt, comments.comment, comments.replies_exist,comments.cid FROM comments left join users on comments.user_id = users.id WHERE cid = " + newComment.cid, { type: Sequelize.QueryTypes.SELECT }).then(function(comments) {
              console.log(comments);
              if(parent!=null && parent.pcid==null) {
                comments[0]['s'] = 1;
              }
              else if(parent==null){
                comments[0]['s'] = 1;
              }
              else{
                comments[0]['s'] = 2;
              }
              console.log(comments);
              res.send(JSON.stringify(comments));
            }).catch(function (error) {
              console.log(error);
            });

          }).catch(function(error) {
            console.log(error);
          });
      }

  });
}
else {
  res.send(false);
}

}


exports.getReplies = function(req, res) {
  var cid = req.body.cid;

  sequelize.query("SELECT users.firstname, comments.user_id, comments.updatedAt, comments.comment, comments.replies_exist,comments.cid FROM comments left join users on comments.user_id = users.id WHERE pcid = " + cid, { type: Sequelize.QueryTypes.SELECT }).then(function(comments) {
    console.log(comments);
    for(var i = 0; i < comments.length; i++) {
      if(req.isAuthenticated() && comments[i].user_id == req.user.id) {
        comments[i].delete = 1;
      }
      else {
        comments[i].delete = 0;
      }
    }
    res.send(JSON.stringify(comments));
  }).catch(function (error) {
    console.log(error);
  });

}

exports.save = function(req, res) {
  if(req.isAuthenticated()) {

  var data = {
    story: req.body.code,
    user_id: req.user.id,
    title: req.body.title,
  }

  models.stories.create(data).then(function(newStory, created) {

     if (!newStory) {

        //return done(null, false);
        res.send(false);

    }

    if (newStory) {
        res.send(newStory);
        //return done(null, newUser);

    }

});
}
else {
  res.send(false);
}
}

exports.write = function(req, res) {
  if(req.isAuthenticated()) {
    res.render('write');
  }
  else {
    res.redirect('/');
  }
}

exports.deleteComment = function(req, res) {
  var cid = req.body.cid;
  sequelize.query("SELECT user_id FROM comments WHERE cid = " + cid, { type: Sequelize.QueryTypes.SELECT }).then(function(comment) {
    if(comment[0].user_id == req.user.id) {
      sequelize.query("DELETE FROM comments WHERE cid = " + cid).then(function(delComment) {
          res.send(true);

    }).catch(function(err) {
        res.send(false);
    });
  }
  }).catch(function(err) {
      res.send(false);
  });

  //res.send(false);

}

exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect('/');

    });

}
