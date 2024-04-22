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
      showDisplayKode: false,
      showDisplayNama: false,
      showDisplayHarga: false,
      showDisplayJumlah: false,
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
        this.kode.length == 0 ||
        this.nama.length === 0 ||
        this.harga.length === 0 ||
        this.jumlah.length === 0
      ) {
        if (this.kode.length != 0) {
          this.showDisplayKode = false;
        } else {
          this.showDisplayKode = true;
        }
        if (this.nama.length != 0) {
          this.showDisplayNama = false;
        } else {
          this.showDisplayNama = true;
        }
        if (this.harga != 0) {
          this.showDisplayHarga = false;
        } else {
          this.showDisplayHarga = true;
        }
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
  watch: {},
});

app.mount("#form");

// ! SCRIPT VUE END

// ! MY SCRIPT JS

let load = document.querySelector(".sp");

window.addEventListener("load", function () {
  load.classList.add("fade-out-animation");
});

// ! MY SCRIPT JS END
