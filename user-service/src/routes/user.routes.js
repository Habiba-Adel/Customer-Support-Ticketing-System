const router = require("express").Router();
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get('/:id', controller.getUserById);

module.exports = router;