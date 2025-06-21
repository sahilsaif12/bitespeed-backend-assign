import { Router } from 'express';
import { identifyContact } from '../controllers/contact.controller';
const router = Router();

router.get('/', (req, res) => {
    res.send('This is GET request , to test the identify route use POST req with json body!');
})
    .post('/', identifyContact)


export default router;
