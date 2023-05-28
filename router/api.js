const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const SteinStore = require("stein-js-client");
const dataFile = "data.json";
const customisationFile = "customisation.json";

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.post("/add/:node", async (req, res) => {
  const { node } = req.params;
  const jsonData = await fs.readFile(dataFile, "utf8");
  const data = JSON.parse(jsonData);
  const dataToStore = {
    date: new Date(),
    val1: req.body.value1,
    val2: req.body.value2,
  };
  data[node].push(dataToStore);

  await fs.writeFile(dataFile, JSON.stringify(data));
  res.json(dataToStore);
});

router.post("/api/add", async (req, res) => {
  const jsonData = await fs.readFile(dataFile, "utf8");
  const data = JSON.parse(jsonData);
  const dataToStore = {
    date: new Date(),
    value1: req.body.value1,
    value2: req.body.value2,
    value3: req.body.value3,
    value4: req.body.value4,
  };
  data.push(dataToStore);
  await fs.writeFile(dataFile, JSON.stringify(data));
  // Stein API Here **************************
  // const store = new SteinStore("https://api.steinhq.com/v1/storages/6453d2d8eced9b09e9cdd875");
  // store.append("Sheet1", [dataToStore]).then((res) => {
  //   console.log(res);
  // });
  // res.status(200).json({ file: "done" });
});

router.post("/custom", async (req, res) => {
  const jsonData = await fs.readFile(customisationFile, "utf8");
  const data = JSON.parse(jsonData);
  const { select, title, subtitle, description, unit, guage, maxValue } =
    req.body;
  const sensor = data.sensor[select];
  sensor.title = title;
  sensor.subtitle = subtitle;
  sensor.description = description;
  sensor.unit = unit;
  sensor.guage = guage;
  sensor.maxValue = maxValue;
  await fs.writeFile(customisationFile, JSON.stringify(data));
  res.redirect("/");
});

router.get("/latest", async (req, res) => {
  const jsonData = await fs.readFile(dataFile, "utf8");
  const data = JSON.parse(jsonData);
  const node1Latest = data["node1"][data["node1"].length - 1];
  const node2Latest = data["node2"][data["node2"].length - 1];
  res.json({
    value1: node1Latest.val1,
    value2: node1Latest.val2,
    value3: node2Latest.val1,
    value4: node2Latest.val2,
    date1: node1Latest.date,
    date2: node2Latest.date,
  });
});
router.get("/history/:node", async (req, res) => {
  const { node } = req.params;
  const jsonData = await fs.readFile(dataFile, "utf8");
  const data = JSON.parse(jsonData);
  let selectedData = [];

  if (node === "value1") {
    selectedData =
      data["node1"]?.map(({ val1, date }) => ({
        value: val1,
        date: new Date(date).toLocaleString(),
      })) || [];
  } else if (node === "value2") {
    selectedData =
      data["node1"]?.map(({ val2, date }) => ({
        value: val2,
        date: new Date(date).toLocaleString(),
      })) || [];
  } else if (node === "value3") {
    selectedData =
      data["node2"]?.map(({ val1, date }) => ({
        value: val1,
        date: new Date(date).toLocaleString(),
      })) || [];
  } else if (node === "value4") {
    selectedData =
      data["node2"]?.map(({ val2, date }) => ({
        value: val2,
        date: new Date(date).toLocaleString(),
      })) || [];
  }

  // Get the last 15 values from selectedData
  selectedData = selectedData.slice(-25);

  res.json(selectedData);
});

router.post("/customHeading", async (req, res) => {
  const jsonData = await fs.readFile(customisationFile, "utf8");
  const data = JSON.parse(jsonData);
  data.title = req.body;
  await fs.writeFile(customisationFile, JSON.stringify(data));
  res.redirect("/");
});

module.exports = router;
