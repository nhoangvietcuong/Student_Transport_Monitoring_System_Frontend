const express = require("express");
const router = express.Router();
const stopController = require("../controllers/stopController");

router.get("/nearby", stopController.getNearbyStops);
router.get("/", stopController.getAll);
router.post("/", stopController.create);
router.get("/:id", stopController.getOne);
router.put("/:id", stopController.update);
router.delete("/:id", stopController.delete);

module.exports = router;