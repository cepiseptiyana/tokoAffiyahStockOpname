// ! SCRIPT VUE =>

const app = Vue.createApp({
  data() {
    return {
      kode: "",
      nama: "",
      harga: "",
      jumlah: "",
      totalBeli: "",
      dataBarang: [],
    };
  },
  methods: {
    addTodo() {},
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
