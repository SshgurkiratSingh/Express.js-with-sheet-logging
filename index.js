const express = require("express");
const fs = require("fs");
const exceljs = require("exceljs");
const SteinStore = require("stein-js-client");
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
  // client.create(dataToStore).then(
  //   function (data) {
  //     console.log(data);
  //   },
  //   function (err) {
  //     console.log(err);
  //   }
  // );
  const store = new SteinStore(
    "https://api.steinhq.com/v1/storages/6453d2d8eced9b09e9cdd875"
  );

  store.append("Sheet1", [dataToStore]).then((res) => {
    console.log(res);
  });
  res.status(200).json({ file: "done" });
});
app.get("/specific/:aa", (req, res) => {
  let nn = req.params.aa;
  if (nn == "s1") {
    nn = "value1";
  } else if (nn == "s2") {
    nn = "value2";
  } else if (nn == "s3") {
    nn = "value3";
  } else if (nn == "s4") {
    nn = "value4";
  }
  let jsonData = JSON.parse(fs.readFileSync("data.json"));
  let newdata = jsonData.map((item) => ({
    value: item[nn],
    date: item.date,
  }));
  val = nn.split("");
  res.render("table.ejs", { data: newdata, name: nn[5] });
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
