var exports = module.exports = {}


exports.signup = function(req, res) {

    res.render('signup', {
      c: 2
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

exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect('/');

    });

}
