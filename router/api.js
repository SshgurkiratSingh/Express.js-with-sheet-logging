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

router.get("/history/:node", async (req, res) => {
  const { node } = req.params;
  const { page, limit } = req.query;
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
  selectedData = selectedData.reverse();

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPages = Math.ceil(selectedData.length / limit);

  const paginatedData = selectedData.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedData,
    totalPages: totalPages,
  });
});


router.post("/customHeading", async (req, res) => {
  const jsonData = await fs.readFile(customisationFile, "utf8");
  const data = JSON.parse(jsonData);
  data.title = req.body;
  await fs.writeFile(customisationFile, JSON.stringify(data));
  res.redirect("/");
});

module.exports = router;
