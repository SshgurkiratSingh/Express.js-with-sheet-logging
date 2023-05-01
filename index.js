const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/get", (req, res) => {
  let jsonData = fs.readFileSync("data.json");
  res.json(JSON.parse(jsonData));
});
app.get("/api/latest", (req, res) => {
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  res.json(jsonData[jsonData.length - 1]);
});
app.post("/api/add", (req, res) => {
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
  res.status(200).json({ file: "done" });
});

app.listen(3000, () => {});
