const adminCredentials = {
    username: 'admin',
    password: 'password123'
};

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        req.session.user = username;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
