exports.getLogin = (req, res, next) =>{
    const isLoggedIn = req.get('Cookie')
        .split(';')[1]
        .trim()
        .split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    req.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
    res.redirect('/');
};