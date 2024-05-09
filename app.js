const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
// ! module validator@6.10.1
const { body, validationResult, check } = require("express-validator");

// ! TANGKAP EXPORT DARI UTILS "OPERASI BARANG MASUK"
const {
  laodContact,
  addContact,
  cekDuplikat,
} = require("./utils/operasiBarangMasuk");
// ! TANGKAP EXPORT DARI UTILS "OPERASI BARANG TERJUAL"
const { dataBarangs, addBarangs } = require("./utils/operasiBarangTerjual");

// ! parse data form
app.use(express.urlencoded());

app.use(expressLayouts);
// ! views engine expressJS menggunakan "ejs"
app.set("view engine", "ejs");

// ! EXPRESS JS MEMILIKI FILE STATIC SEPERTI = FILE,VIDEO,GAMBAR DLL
// ! panggil module
app.use(express.static("public"));

// ! METHOD "POST" FORM DATA BARANG MASUK
app.post(
  "/halamanInput",
  [
    body("kodeBarang").custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("kode barang sudah digunakan, gunakan kode lain!");
      }
      return;
    }),
    check("namaBarang", "wajib isi nama barang").isLength({ min: 2 }),
    check("jumlahBarangMasuk", "wajib isi jumlah barang").isLength({ min: 2 }),
    check("totalHargaBeliBarang", "wajib isi total harga beli barang").isLength(
      {
        min: 3,
      }
    ),
    check("tanggal", "wajib isi tanggal").isLength({ min: 5 }),
  ],
  (req, res) => {
    // ! tangkap error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ! jika error balik ke halaman input
      res.render("halamanInput", {
        title: "form data tambah contact",
        layout: "layouts/main-layout",
        // isi dari errors.array() = array
        errors: errors.array(),
      });
    } else {
      console.log(req.body);
      addContact(req.body);
      // ! redirect = dia akan menangani bukan POST tapi GET
      // ! redirect = refresh ke halaman tersebut =>
      res.redirect("/dataBarangMasuk");
    }
  }
);

// ! METHOD "POST" FORM DATA BARANG TERJUAL
app.post("/barangTerjual", (req, res) => {
  console.log(req.body);
  addBarangs(req.body);
  // ! redirect = dia akan menangani bukan POST tapi GET
  // ! redirect = refresh ke halaman tersebut =>
  res.redirect("/dataBarangTerjual");
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
  const barangTerjual = dataBarangs();
  res.render("dataBarangTerjual", {
    layout: "layouts/main-layout.ejs",
    title: "halaman barangTerjual",
    barangTerjual,
  });
});

// ! ketika halaman url salah / gada => tampilkan error
app.use("/", (req, res) => {
  res.send("<h1>error ; 404</h1>");
});

app.listen(port, () => {
  console.log(`example port ${port}`);
});
