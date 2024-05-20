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
  findContact,
  deleteContact,
} = require("./utils/operasiBarangMasuk");
// ! TANGKAP EXPORT DARI UTILS "OPERASI BARANG TERJUAL"
const {
  dataBarangs,
  addBarangs,
  cekDuplikatBrTerjual,
} = require("./utils/operasiBarangTerjual");

// ! parse data form
app.use(express.urlencoded());

app.use(expressLayouts);
// ! views engine expressJS menggunakan "ejs"
app.set("view engine", "ejs");

// ! EXPRESS JS MEMILIKI FILE STATIC SEPERTI = FILE,VIDEO,GAMBAR DLL
// ! panggil module
app.use(express.static("public"));

// ! METHOD "POST" FORM DATA BARANG MASUK
// ! ada 3 parameter = root / halaman, pengecekan / validator input, callback request dan resonse express.js
app.post(
  "/halamanInput",
  // ! Pengecekan pada input kodeBarang apakah ada kode yang duplikat
  // ! parameter body harus sama dengan atribut name di element input kodeBarang
  [
    body("kodeBarang").custom((value) => {
      const duplikat = cekDuplikat(value);
      // ! jika kodeBarang tidak ada duplikat maka jangan buat pesan error
      // ! jika ada duplikat tuliskan error berikut ini
      if (duplikat) {
        throw new Error("kode barang sudah digunakan, gunakan kode lain!");
      }
      // ! error ini me return true jika gada error/duplikat kodebarang
      return true;
    }),
    // ! pengecekan input namaBarang wajib isi minimal 2 karakter
    check("namaBarang", "wajib isi nama barang").isLength({ min: 2 }),
    // ! pengecekan input jumlahBarangMasuk wajib isi minimal 2 karakter dan harus isi angka
    check("jumlahBarangMasuk", "wajib isi jumlah barang dan isi dengan angka")
      .isLength({ min: 2 })
      .isNumeric(),
    // ! pengecekan input totalHargaBeliBarang wajib isi minimal 3 karakter
    check("totalHargaBeliBarang", "wajib isi total harga beli barang").isLength(
      {
        min: 3,
      }
    ),
    // ! pengecekan input tanggal wajib isi minimal 5 karakter
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
      // ! jika gada error masukan data ke file json menggunakan fungsi 'addContact()'
      addContact(req.body);
      // ! redirect = dia akan menangani bukan POST tapi GET
      // ! redirect = refresh ke halaman tersebut =>
      res.redirect("/dataBarangMasuk");
    }
  }
);

// ! METHOD "POST" FORM DATA BARANG TERJUAL
app.post(
  "/barangTerjual",
  [
    body("kodeBarang").custom((value) => {
      const duplikat = cekDuplikatBrTerjual(value);
      if (duplikat) {
        throw new Error("kode barang sudah digunakan, gunakan kode lain!");
      }
      // ! error ini me return true jika gada error/duplikat kodebarang
      return true;
    }),
    check("namaBarang", "wajib isi nama barang").isLength({ min: 2 }),
    check("jumlahBarangTerjual", "wajib isi jumlah barang dan isi dengan angka")
      .isLength({
        min: 2,
      })
      .isNumeric(),
    check("jumlahHargaTerjual", "wajib isi dengan angka").isNumeric(),
    check("tanggal", "wajib isi tanggal").isLength({ min: 5 }),
  ],
  (req, res) => {
    // ! tangkap error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ! jika error balik ke halaman input
      res.render("barangTerjual", {
        title: "form data barang terjual",
        layout: "layouts/main-layout",
        // isi dari errors.array() = array
        errors: errors.array(),
      });
    } else {
      addBarangs(req.body);
      // ! redirect = dia akan menangani bukan POST tapi GET
      // ! redirect = refresh ke halaman tersebut =>
      res.redirect("/dataBarangTerjual");
    }
  }
);

// ! midleware/root = home
app.get("/", (req, res) => {
  res.render("HalamanInput.ejs", {
    title: "BarangMasuk",
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

// ! delete data barang masuk
app.get("/dataBarangMasuk/delete/:kodeBarang", (request, response) => {
  // ! databarangs berisi object sesuai KodeBarang
  const dataBarangs = findContact(request.params.kodeBarang);
  // ! jika data barang undefined atau nama kodeBarang ga ditemukan atau gada kembalikan error
  if (!dataBarangs) {
    // ! kembalikan status error 404
    response.status(404);
    response.send("kode barang tidak ditemukan!");
  } else {
    // ! delete kontak dengan jalankan fungsi deleteContact =>
    deleteContact(request.params.kodeBarang);
    response.redirect("/dataBarangMasuk");
  }
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
