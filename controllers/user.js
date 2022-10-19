const User = require('../models/user');
const Report = require('../models/report');

// Render login page & form

module.exports.renderLoginForm = async (req, res) => {
    res.render('users/login.ejs');
}

// login the user

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/reports';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}

// Render signup poge & form

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

// Register/ signup the user

module.exports.signupUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully Signed-up');
            res.redirect('/reports');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup')
    }
}

// Logout the user

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Goodbye');
        res.redirect('/reports');
    });

}

// Profile 

module.exports.profile = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const reports = (await Report.find({ author: id }).populate('author')).reverse();
    res.render('users/profile.ejs', { reports, user });
}