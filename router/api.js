const express = require("express");
const router = express.Router();
const fs = require("fs");
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.post("/custom", async (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  data.sensor[req.body.select].title = req.body.title;
  data.sensor[req.body.select].subtitle = req.body.subtitle;
  data.sensor[req.body.select].description = req.body.description;
  fs.writeFileSync("customisation.json", JSON.stringify(data));

  res.redirect("/");
});
router.post("/customHeading", async (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  data.title = req.body;
  fs.writeFileSync("customisation.json", JSON.stringify(data));

  res.redirect("/");
});
module.exports = router;
