// ! SCRIPT VUE =>

const app = Vue.createApp({
  data() {
    return {
      kode: "",
      nama: "",
      harga: "",
      jumlah: "",
      total: "",
      dataBarang: [],
      showDisplayKode: true,
      showDisplayNama: true,
      showDisplayHarga: true,
      showDisplayJumlah: true,
      showDisplayTotal: true,
      isiData: false,
    };
  },
  methods: {
    addTodo() {
      let dataBarang = {
        kode: this.kode,
        nama: this.nama,
        harga: this.harga,
        jumlah: this.jumlah,
        total: this.total,
      };
      if (
        this.kode.length < 2 ||
        this.nama.length < 2 ||
        this.harga.length < 2 ||
        this.jumlah.length < 2 ||
        this.total.length < 2
      ) {
        this.isiData = true;
      } else {
        // ! DATA BARANG = ARRAY DI UBAH MENJADI JSON

        this.dataBarang.push(dataBarang);
        let a = JSON.stringify(this.dataBarang);
        console.log(a);
        this.isiData = false;
      }
    },
  },
  watch: {
    kode(value) {
      value != 0
        ? (this.showDisplayKode = false)
        : (this.showDisplayKode = true);
    },
    nama(value) {
      value != 0
        ? (this.showDisplayNama = false)
        : (this.showDisplayNama = true);
    },
    harga(value) {
      value != 0
        ? (this.showDisplayHarga = false)
        : (this.showDisplayHarga = true);
    },
    jumlah(value) {
      value != 0
        ? (this.showDisplayJumlah = false)
        : (this.showDisplayJumlah = true);
    },
    total(value) {
      value != 0
        ? (this.showDisplayTotal = false)
        : (this.showDisplayTotal = true);
    },
  },
});

app.mount("#form");

// ! SCRIPT VUE END

// ! MY SCRIPT JS

let load = document.querySelector(".sp");

window.addEventListener("load", function () {
  load.classList.add("fade-out-animation");
});

// ! MY SCRIPT JS END
