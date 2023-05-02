const express = require("express");
const fs = require("fs");
const app = express();
const api = require("./router/api.js");

app.use("/api", api);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/api/get", (req, res) => {
  let jsonData = fs.readFileSync("data.json");
  res.json(JSON.parse(jsonData));
});
app.get("/api/getspecific/:id", (req, res) => {
  let nn = req.params.id;
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  let newdata = jsonData.map((item) => ({
    value: item[nn],
    date: item.date,
  }));

  res.json(newdata);
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
app.get("/specific/:aa", (req, res) => {
  let nn = req.params.aa;
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  let newdata = jsonData.map((item) => ({
    value: item[nn],
    date: item.date,
  }));

  res.render("table.ejs", { data: newdata, name: nn });
});
app.listen(3000, () => {});
