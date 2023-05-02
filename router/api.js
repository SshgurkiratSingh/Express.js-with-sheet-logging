const express = require("express");
const router = express.Router();
const fs = require("fs");
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

module.exports = router;
