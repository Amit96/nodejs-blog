var authController = require('../controllers/authcontroller.js');


module.exports = function(app, passport) {

    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/logout',authController.logout);

    app.get('/story',authController.story);

    app.post('/save', authController.save);

    app.post('/saveComment',authController.saveComment);

    app.post('/getReplies',authController.getReplies);

    app.post('/deleteComment',authController.deleteComment);


    app.get('/write',authController.write);


    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup'
        }

    ));

    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/',
            failureRedirect: '/signin'
        }

    ));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }


}
