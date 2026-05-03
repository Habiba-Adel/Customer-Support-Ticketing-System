const router = require("express").Router();
const controller = require("../controllers/ticket.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth(["customer"]), controller.createTicket);

router.get("/", auth(["customer", "agent"]), controller.getTickets);
router.get("/:id", auth(["customer", "agent"]), controller.getTicketById);

router.put("/:id", auth(["customer"]), controller.updateTicket);

router.put("/:id/status", auth(["agent"]), controller.updateStatus);

router.delete("/:id", auth(["customer"]), controller.deleteTicket);

module.exports = router;