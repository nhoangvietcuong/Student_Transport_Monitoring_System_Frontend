const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

// Định nghĩa các endpoint
router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
