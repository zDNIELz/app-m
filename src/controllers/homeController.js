exports.homePage = (req, res) => {
    res.render('index', { activePage: 'home' });
};

exports.treatPost = (req, res) => {
    res.send(req.body);
    return;
};