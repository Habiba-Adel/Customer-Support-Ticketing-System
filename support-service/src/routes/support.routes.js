const express=require('express')
const router = express.Router();
const supportController=require('../controllers/support.controller')
router.post('/assign' , supportController.assignAgent);
router.post('/respond' , supportController.addResponse)
router.get('/:ticketId', supportController.getTicket);
router.put('/resolve/:ticketId', supportController.resolveTicket);
router.put('/close/:ticketId', supportController.closeTicket);
router.put('/reopen/:ticketId', supportController.reopenTicket);
module.exports = router;