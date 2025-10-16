exports.homePage = (req, res) => {
    res.render('diary', { activePage: 'diary' });
};