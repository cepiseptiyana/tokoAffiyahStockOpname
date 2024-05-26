const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 80;
// ! module validator@6.10.1
const { body, validationResult, check } = require("express-validator");

// jalankan koneksi mongoose
require("./utils/database");
// database dataBarangMasuk Mongoose
const dataBarangMongoose = require("./models/dataBaseMongoose.js");
// database dataBarangTerjual Mongoose
const dataBarangTerjualMongoose = require("./models/dataTerjualMongoose.js");
// database Login
const login = require("./models/databaseLogin.js");

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
      // masukan data ke dataBase mongoDB
      dataBarangMongoose.insertMany(req.body, (errors, result) => {
        // ! redirect = dia akan menangani bukan POST tapi GET
        // ! redirect = refresh ke halaman tersebut =>
        res.redirect("/dataBarangMasuk");
      });
    }
  }
);

// ! METHOD "POST" FORM DATA BARANG TERJUAL
app.post(
  "/barangTerjual",
  [
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
      dataBarangTerjualMongoose.insertMany(req.body, (errors, result) => {
        // ! redirect = dia akan menangani bukan POST tapi GET
        // ! redirect = refresh ke halaman tersebut =>
        res.redirect("/dataBarangTerjual");
      });
    }
  }
);

// ! midleware/root = Login
app.get("/", async (req, res) => {
  // kirim dataLog ke form login
  const dataLogin = await login.findOne({ username: "admin" });
  res.render("login", {
    title: "login",
    layout: "layouts/main-layout.ejs",
    dataLogin,
  });
});

// ! POST FORM LOGIN
app.post(
  "/login",
  [
    body("username").custom(async (value, { req }) => {
      const user = await login.findOne({ username: "admin" });
      if (value !== user.username) {
        throw new Error(`selamat datang di toko afiyah username salah!`);
      }
      return true;
    }),
    body("password").custom(async (value, { req }) => {
      const pass = await login.findOne({ username: "admin" });
      if (value !== pass.password) {
        throw new Error(`selamat datang di toko afiyah password salah!`);
      }
      return true;
    }),
  ],
  (req, res) => {
    // ambil request dari form login
    console.log(req.body);
    // jika data error ga kosong alias ada error =>
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("login.ejs", {
        title: "dataBarangMasuk",
        layout: "layouts/main-layout.ejs",
        errors: errors.array(),
        dataLogin: req.body,
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
  // ambil dataBarang dari dataBase MongoDB
  const dataBarang = await dataBarangMongoose.find();
  // ! mengirim database ke file databarangmasuk.ejs
  res.render("dataBarangMasuk", {
    title: "dataBarangMasuk",
    layout: "layouts/main-layout.ejs",
    dataBarang,
  });
});

// ! delete data barang masuk
app.get("/dataBarangMasuk/delete/:kodeBarang", async (request, response) => {
  // temukan kodeBarang mongoDB yang sama dengan req.params lalu hapus
  const dataBarangs = await dataBarangMongoose.findOne({
    _id: request.params.kodeBarang,
  });
  // handle ketika id.params gasama
  // ! jika data barang undefined atau nama kodeBarang ga ditemukan atau gada kembalikan error
  if (!dataBarangs) {
    // ! kembalikan status error 404
    response.status(404);
    response.send("kode barang tidak ditemukan!");
  } else {
    // delete data mongoDB sesuai dengan id.params.kodebarang
    dataBarangMongoose
      .deleteOne({ _id: request.params.kodeBarang })
      .then((result) => {
        response.redirect("/dataBarangMasuk");
      });
  }
});

// data mongoose berupa PROMISE dan dia asynchronous ketika di panggil di dalam function maka function harus menggunakan ( asyc await ) untuk menandakan data mana yang berupa asynchronous
app.get("/dataBarangTerjual", async (req, res) => {
  // ambil dataBarang dari dataBase MongoDB
  const barangTerjual = await dataBarangTerjualMongoose.find();
  res.render("dataBarangTerjual", {
    layout: "layouts/main-layout.ejs",
    title: "halaman barangTerjual",
    barangTerjual,
  });
});

// ! delete data barang terjual
app.get("/dataBarangTerjual/delete/:kodeBarang", async (request, response) => {
  // temukan kodeBarang mongoDB yang sama dengan req.params lalu hapus
  const dataBarangs = await dataBarangTerjualMongoose.findOne({
    _id: request.params.kodeBarang,
  });
  // jika data _id ga ditemukan
  if (!dataBarangs) {
    // ! kembalikan status error 404
    response.status(404);
    response.send("kode barang tidak ditemukan!");
  } else {
    // delete data mongoDB sesuai dengan id.params.kodebarang
    dataBarangTerjualMongoose
      .deleteOne({ _id: request.params.kodeBarang })
      .then((result) => {
        response.redirect("/dataBarangTerjual");
      });
  }
});

// ! ketika halaman url salah / gada => tampilkan error
app.use("/", (req, res) => {
  res.send("<h1>error ; 404</h1>");
});

app.listen(port, () => {
  console.log(`example port ${port}`);
});
