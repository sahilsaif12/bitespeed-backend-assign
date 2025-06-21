class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the Express backend application for BITESPEED assignment!');
    }
}

module.exports = IndexController;