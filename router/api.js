const express = require("express");
const router = express.Router();
const fs = require("fs");

router.use(express.json());

router.use(express.urlencoded({ extended: false }));
router.post("/custom", async (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  data.sensor[req.body.select].title = req.body.title;
  data.sensor[req.body.select].subtitle = req.body.subtitle;
  data.sensor[req.body.select].description = req.body.description;
  data.sensor[req.body.select].unit = req.body.unit;
  data.sensor[req.body.select].guage = req.body.guage;
  console.log(req.body);

  fs.writeFileSync("customisation.json", JSON.stringify(data));

  res.redirect("/");
});
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
router.post("/", (req, res) => {
  console.log(req.body);
  res.json({ message: "Welcome to the API", date: new Date() });
});
router.post("/customHeading", async (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  data.title = req.body;
  fs.writeFileSync("customisation.json", JSON.stringify(data));

  res.redirect("/");
});
module.exports = router;
