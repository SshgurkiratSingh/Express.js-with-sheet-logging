const express = require("express");
const router = express.Router();
const fs = require("fs");
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.post("/custom", (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  res.json("done");
  console.log(req.body);
});
module.exports = router;
