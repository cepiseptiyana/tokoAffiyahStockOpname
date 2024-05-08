const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;

// ! TANGKAP EXPORT MODULE "LOCAL"
const { laodContact, addContact } = require("./utils/operasiContact");

// ! parse data form
app.use(express.urlencoded());

app.use(expressLayouts);
// ! views engine expressJS menggunakan "ejs"
app.set("view engine", "ejs");

app.post("/dataBarangMasuk", (req, res) => {
  console.log(req.body);
  addContact(req.body);
  // ! redirect = dia akan menangani bukan POST tapi GET
  // ! redirect = refresh ke halaman tersebut =>
  res.redirect("/dataBarangMasuk");
});

// ! midleware/root = home
app.get("/home", (req, res) => {
  res.render("home.ejs", {
    title: "home",
    layout: "layouts/main-layout.ejs",
  });
});

// ! midleware/root = halamanInput
app.get("/halamanInput", (req, res) => {
  res.render("halamanInput", {
    layout: "layouts/main-layout.ejs",
    title: "halaman input",
  });
});

// ! midleware/root = barangTerjual
app.get("/barangTerjual", (req, res) => {
  res.render("barangTerjual", {
    layout: "layouts/main-layout.ejs",
    title: "halaman barangTerjual",
  });
});

// ! midleware/root = dataBarangMasuk
app.get("/dataBarangMasuk", (req, res) => {
  const contacts = laodContact();
  // ! mengirim file dataBarang.json ke file databarangmasuk.ejs
  res.render("dataBarangMasuk", {
    title: "dataBarangMasuk",
    layout: "layouts/main-layout.ejs",
    contacts,
  });
});

app.get("/dataBarangTerjual", (req, res) => {
  res.render("dataBarangTerjual", {
    layout: "layouts/main-layout.ejs",
    title: "halaman barangTerjual",
  });
});

app.use("/", (req, res) => {
  res.send("ERROR ;404");
});

app.listen(port, () => {
  console.log(`example port ${port}`);
});
