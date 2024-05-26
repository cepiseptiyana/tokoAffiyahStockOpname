// membuat schema moongose / model / collection di database

const mongoose = require("mongoose");

const dataBarang = mongoose.model("dataBarang", {
  // field atau property pada collection
  // kodeBarang: {
  //   type: String,
  //   required: true,
  // },

  // jika salah satu data required kosong atau gamasukan datanya schema/database ini ga bisa digunakan alias gabisa di tambah data,panggil data atau disebut(CRUD)
  namaBarang: {
    type: String,
    required: true,
  },
  jumlahBarangMasuk: {
    type: String,
    required: true,
  },
  totalHargaBeliBarang: {
    type: String,
  },
  tanggal: {
    type: String,
    required: true,
  },
});

// export local module
module.exports = dataBarang;
