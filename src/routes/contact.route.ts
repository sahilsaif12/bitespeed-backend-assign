import { Router } from 'express';
const router = Router();
// Example controller import
// const ContactController = require('../../controllers/contact');
// const contactController = new ContactController();

// Example GET /contact
router.get('/', (req, res) => {
    res.send('This is GET request , to test the identify route use POST req with json body!');
});

export default router;
