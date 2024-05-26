// membuat schema moongose / model / collection di database

const mongoose = require("mongoose");

const dataBarangTerjual = mongoose.model("dataBarangTerjual", {
  // field atau property pada collection
  // requiere wajib di isi kalo ga di isi database ga terhubung jika di masukan datanya di node js
  namaBarang: {
    type: String,
    required: true,
  },
  jumlahBarangTerjual: {
    type: String,
    required: true,
  },
  jumlahHargaTerjual: {
    type: String,
    required: true,
  },
  tanggal: {
    type: String,
    required: true,
  },
});

// export local module
module.exports = dataBarangTerjual;
