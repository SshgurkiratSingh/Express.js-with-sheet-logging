const express = require("express");
const fs = require("fs");
const exceljs = require("exceljs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const api = require("./router/api.js");
const sheetdb = require("sheetdb-node");
let config = {
  address: process.env.SHEET_ADDRESS,
};

app.use(cors());
var client = sheetdb(config);

app.use("/api", api);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const jsonData = fs.readFileSync("customisation.json", "utf8");
  const { sensor, title } = JSON.parse(jsonData);
  res.render("index.ejs", { data: sensor, title: title });
});

app.get("/api/get", (req, res) => {
  const jsonData = fs.readFileSync("data.json", "utf8");
  const data = JSON.parse(jsonData);
  const node1Latest = data["node1"][data["node1"].length - 1];
  const node2Latest = data["node2"][data["node2"].length - 1];
  const date1 = new Date(node1Latest.date).toISOString();
  const date2 = new Date(node2Latest.date).toISOString();

  res.status(200).json({
    value1: node1Latest.val1,
    value2: node1Latest.val2,
    value3: node2Latest.val1,
    value4: node2Latest.val2,
    date1: date1,
    date2: date2,
  });
});

app.get("/api/getspecific/:id", (req, res) => {
  const nn = req.params.id;
  const jsonData = fs.readFileSync("data.json", "utf8");
  const data = JSON.parse(jsonData);
  const newdata = data.map((item) => ({
    value: item[nn],
    date: item.date,
  }));

  res.json(newdata);
});

app.get("/specific/:aa", (req, res) => {
  let nn = req.params.aa;
  let jj;
  if (nn == "s1") {
    nn = "val1";
    jj = "node1";
  } else if (nn == "s2") {
    nn = "val2";
    jj = "node1";
  } else if (nn == "s3") {
    nn = "val3";
    jj = "node2";
  } else if (nn == "s4") {
    nn = "val4";
    jj = "node2";
  }
  const jsonData = fs.readFileSync("data.json", "utf8");
  const data = JSON.parse(jsonData);
  const newdata = data[jj].map((item) => ({
    value: item[nn],
    date: item.date,
  }));
  const val = nn.split("");

  res.render("table.ejs", { data: newdata, name: nn[3] });
});

app.get("/exp", async (req, res) => {
  try {
    const jsonData = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(jsonData);
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("data");
    sheet.columns = [
      { header: "date", key: "date", width: 20 },
      { header: "value1", key: "value1", width: 20 },
      { header: "value2", key: "value2", width: 20 },
      { header: "value3", key: "value3", width: 20 },
      { header: "value4", key: "value4", width: 20 },
    ];

    data.forEach((item) => {
      sheet.addRow({
        date: item.date,
        value1: item.value1,
        value2: item.value2,
        value3: item.value3,
        value4: item.value4,
      });
    });

    await workbook.xlsx.writeFile("./public/history.xlsx");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  res.redirect("/public/history.xlsx");
});

app.get("/custom", (req, res) => {
  res.render("custom.ejs");
});

app.listen(3000, () => {});
