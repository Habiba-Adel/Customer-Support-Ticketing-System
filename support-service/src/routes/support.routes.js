const express=require('express')
const router = express.Router();
const supportController=require('../controllers/support.controller')
router.post('/assign' , supportController.assignAgent);
router.post('/respond' , supportController.addResponse)
router.put('/resolve/:ticketId', supportController.resolveTicket);
router.get('/:ticketId', supportController.getTicket);


module.exports = router;