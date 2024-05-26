// responsive size 768px
// toggle pada li navbar file halamanInput dan barangTerjual
// toggle tabel dataBarangMasuk dan dataBarangTerjual
document.getElementById("btn-toggle").addEventListener("click", function () {
  // backgroundColor pada Nav
  const containerNav = Array.from(
    document.querySelectorAll("#app .c .c-2 .nav-ul .nav-item")
  );
  containerNav.forEach((list) => {
    list.classList.toggle("click");
  });

  // geser element form dan element tabel
  const elementForm = document.querySelector("#form");
  elementForm.classList.toggle("toggle-form");
});
