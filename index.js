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
  findContact,
  deleteContact,
  cekDuplikat,
} = require("./utils/operasiBarangMasuk");
// ! TANGKAP EXPORT DARI UTILS "OPERASI BARANG TERJUAL"
const {
  dataBarangs,
  addBarangs,
  findBarang,
  deleteBarang,
  cekDuplikatBrTerjual,
} = require("./utils/operasiBarangTerjual");
// ! TANGKAP EXPORT DARI UTILS "loginJson"
const { jsonLogin } = require("./utils/loginJson.js");

// ! parse data input form
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
  "/HalamanInput",
  // ! Pengecekan pada input kodeBarang apakah ada kode yang duplikat
  // ! parameter body harus sama dengan atribut name di element input kodeBarang
  [
    body("kodeBarang").custom((value) => {
      const duplikat = cekDuplikat(value);
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
      .isLength({ min: 1 })
      .isNumeric(),
    // ! pengecekan input tanggal wajib isi minimal 5 karakter
    check("tanggal", "wajib isi tanggal").isLength({ min: 5 }),
  ],
  (req, res) => {
    // jika data error ga kosong alias ada error =>
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
      // kirim data ke json data barang masuk
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
        min: 1,
      })
      .isNumeric(),
    check("jumlahHargaTerjual", "wajib isi dengan angka").isNumeric(),
    check("tanggal", "isi tanggal dengan benar").isLength({ min: 5 }),
  ],
  (req, res) => {
    // jika data error ga kosong alias ada error =>
    // ! tangkap error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ! jika error balik ke halaman input
      res.render("barangTerjual", {
        title: "form data barang terjual",
        layout: "layouts/main-layout",
        // errors.array() = berupa array
        errors: errors.array(),
      });
    } else {
      // kirim data ke json data barang terjual
      addBarangs(req.body);
      // ! redirect = dia akan menangani bukan POST tapi GET
      // ! redirect = refresh ke halaman tersebut =>
      res.redirect("/dataBarangTerjual");
    }
  }
);

// ! midleware/root = Login
app.get("/", async (req, res) => {
  const user = jsonLogin();
  console.log(user);
  res.render("login", {
    title: "login",
    layout: "layouts/main-layout.ejs",
  });
});

// ! POST FORM LOGIN
app.post(
  "/login",
  [
    body("username").custom((value, { req }) => {
      const user = jsonLogin();
      if (value !== user[0].username) {
        throw new Error(`selamat datang di toko afiyah username salah!`);
      }
      return true;
    }),
    body("password").custom((value, { req }) => {
      const pass = jsonLogin();
      if (value !== pass[1].password) {
        throw new Error(`selamat datang di toko afiyah password salah!`);
      }
      return true;
    }),
  ],
  (req, res) => {
    // jika data error ga kosong alias ada error =>
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login.ejs", {
        title: "dataBarangMasuk",
        layout: "layouts/main-layout.ejs",
        errors: errors.array(),
      });
    } else {
      res.redirect("/halamanInput");
    }
  }
);

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
app.get("/dataBarangMasuk", async (req, res) => {
  const dataBarang = laodContact();
  // ! mengirim file dataBarang.json ke file databarangmasuk.ejs
  // ! mengirim database ke file databarangmasuk.ejs
  res.render("dataBarangMasuk", {
    title: "dataBarangMasuk",
    layout: "layouts/main-layout.ejs",
    dataBarang,
  });
});

// ! delete data barang masuk
app.get("/dataBarangMasuk/delete/:kodeBarang", (request, response) => {
  // ! databarangs berisi object sesuai KodeBarang
  const dataBarangs = findContact(request.params.kodeBarang);
  // handle ketika id.params gasama
  // ! jika data barang undefined atau nama kodeBarang ga ditemukan atau gada kembalikan error
  if (!dataBarangs) {
    // ! kembalikan status error 404
    response.status(404);
    response.send("kode barang tidak ditemukan!");
  } else {
    // ! delete kontak dengan jalankan fungsi deleteContact =>
    deleteContact(dataBarangs.kodeBarang);
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

// ! delete data barang terjual
app.get("/dataBarangTerjual/delete/:kodeBarang", async (request, response) => {
  const dataBarangs = findBarang(request.params.kodeBarang);
  // jika data _id ga ditemukan
  if (!dataBarangs) {
    // ! kembalikan status error 404
    response.status(404);
    response.send("kode barang tidak ditemukan!");
  } else {
    // ! delete kontak dengan jalankan fungsi deleteContact =>
    deleteBarang(dataBarangs.kodeBarang);
    response.redirect("/dataBarangTerjual");
  }
});

// ! ketika halaman url salah / gada => tampilkan error
app.use("/", (req, res) => {
  res.send("<h1>error ; 404</h1>");
});

app.listen(port, () => {
  console.log(`example port ${port}`);
});
