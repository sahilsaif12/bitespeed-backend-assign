class IndexController {
    getIndex(req, res) {
        res.send('Welcome to the Express backend application!');
    }
}

module.exports = IndexController;