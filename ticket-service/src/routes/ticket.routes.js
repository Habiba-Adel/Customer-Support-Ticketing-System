const router = require("express").Router();
const controller = require("../controllers/ticket.controller");
const auth = require("../middleware/auth.middleware");


// Customer creates ticket
router.post(
  "/",
  auth(["customer"]),
  controller.createTicket
);


// Customer + Agent view tickets
router.get(
  "/",
  auth(["customer", "agent"]),
  controller.getTickets
);

router.get(
  "/:id",
  auth(["customer", "agent"]),
  controller.getTicketById
);


// Customer updates ticket details
router.put(
  "/:id",
  auth(["customer"]),
  controller.updateTicket
);


// Agent updates status
router.put(
  "/:id/status",
  auth(["agent"]),
  controller.updateStatus
);


// Customer deletes ticket
router.delete(
  "/:id",
  auth(["customer"]),
  controller.deleteTicket
);

module.exports = router;