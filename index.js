const express = require("express");
const fs = require("fs");
const exceljs = require("exceljs");

const app = express();
const api = require("./router/api.js");
const sheetdb = require("sheetdb-node");
let config = {
  address: "aavb2ip9w4zds",
};

var client = sheetdb(config);

app.use("/api", api);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let jsonData = fs.readFileSync("customisation.json");
  let { sensor, title } = JSON.parse(jsonData);
  res.render("index.ejs", { data: sensor, title: title });
});

app.get("/api/get", (req, res) => {
  let jsonData = fs.readFileSync("data.json");

  let data = JSON.parse(jsonData);
  let date1 = new Date(data["node1"][data["node1"].length - 1].date);
  let date2 = new Date(data["node2"][data["node2"].length - 1].date);
  console.log(date1.toISOString());

  res
    .json({
      value1: data["node1"][data["node1"].length - 1].val1,
      value2: data["node1"][data["node1"].length - 1].val2,
      value3: data["node2"][data["node2"].length - 1].val1,
      value4: data["node2"][data["node2"].length - 1].val2,
      date1: date1,
      date2: date2,
    })
    .status(200);
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
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  let newdata = jsonData[jj].map((item) => ({
    value: item[nn],
    date: item.date,
  }));
  val = nn.split("");
  res.render("table.ejs", { data: newdata, name: nn[3] });
});
app.get("/exp", async (req, res) => {
  try {
    let jsonData = fs.readFileSync("data.json");
    let data = JSON.parse(jsonData);
    let workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet("data");
    sheet.columns = [
      { header: "date", key: "date", width: 20 },
      { header: "value1", key: "value1", width: 20 },
      { header: "value2", key: "value2", width: 20 },
      { header: "value3", key: "value3", width: 20 },
      { header: "value4", key: "value4", width: 20 },
    ];

    await data.map((item) => {
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
    res.status(400).json({ error: e.message });
  }
  res.redirect("/public/history.xlsx");
});

app.get("/custom", (req, res) => {
  res.render("custom.ejs");
});
app.listen(3000, () => {});
