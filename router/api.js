const express = require("express");
const router = express.Router();
const fs = require("fs");
const SteinStore = require("stein-js-client");
router.use(express.json());

router.use(express.urlencoded({ extended: false }));

router.post("/api/add", (req, res) => {
  console.log(req.body);
  let jsonData = fs.readFileSync("data.json");
  let data = JSON.parse(jsonData);
  let dataToStore = {
    date: new Date(),
    value1: req.body.value1,
    value2: req.body.value2,
    value3: req.body.value3,
    value4: req.body.value4,
  };
  data.push(dataToStore);
  fs.writeFileSync("data.json", JSON.stringify(data));
  // client.create(dataToStore).then(
  //   function (data) {
  //     console.log(data);
  //   },
  //   function (err) {
  //     console.log(err);
  //   }
  // );
  //Stlein Api Here **************************
  // const store = new SteinStore(
  //   "https://api.steinhq.com/v1/storages/6453d2d8eced9b09e9cdd875"
  // );

  // store.append("Sheet1", [dataToStore]).then((res) => {
  //   console.log(res);
  // });
  // res.status(200).json({ file: "done" });
});
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
router.get("/latest", (req, res) => {
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  res.json(jsonData[jsonData.length - 1]);
});
router.post("/customHeading", async (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let data = JSON.parse(jsonData);
  data.title = req.body;
  fs.writeFileSync("customisation.json", JSON.stringify(data));

  res.redirect("/");
});
module.exports = router;
