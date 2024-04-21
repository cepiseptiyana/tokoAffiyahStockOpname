// ! SCRIPT VUE JS
// ! INSTANCE VUE
const app = Vue.createApp({
  data() {
    return {
      username: "",
      gender: "",
      hobi: [],
    };
  },
  methods: {
    say() {
      alert("halo");
    },
  },
});
app.mount("#app");

// ! SCRIPT VUE JS END

// ---

// ! MY SCIPT JS

let load = document.querySelector(".sp");

window.addEventListener("load", function () {
  load.classList.add("fade-out-animation");
});

// ! MY SCIPT JS END
