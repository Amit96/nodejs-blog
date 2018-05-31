var exports = module.exports = {}


exports.signup = function(req, res) {

    res.render('signup', {
      home: true,
      signin: true,
      signup: false
    });
}

exports.signin = function(req, res) {

    res.render('signin', {
      home: true,
      signin: false,
      signup: true
    });

}

exports.dashboard = function(req, res) {

    res.render('dashboard');

}

exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect('/');

    });

}
