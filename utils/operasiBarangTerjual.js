// local module
const fs = require("node:fs");

// ! FUNCTION FILE JSON
// ! AMBIL SEMUA DATA DI CONTACT.JSON
function dataBarangs() {
  let file = fs.readFileSync("data/dataBarangTerjual.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
}

function saveContacts(contact) {
  // ! object CONTACT ubah jadi string lalu masukan/timpah ke file contacts.json
  fs.writeFileSync("data/dataBarangTerjual.json", JSON.stringify(contact));
}

// ! menambahkan contact data baru
function addBarangs(contact) {
  const contacts = dataBarangs();
  // ! push ke variabel contacts
  contacts.push(contact);
  // ! masukan data baru ke contacts.json
  saveContacts(contacts);
}

// ! cek nama yang duplikat
function cekDuplikatBrTerjual(nama) {
  const contacts = dataBarangs();
  return contacts.find((contact) => contact.kodeBarang === nama);
}

// ! EXPORT MODULE LOCAL
module.exports = { dataBarangs, addBarangs, cekDuplikatBrTerjual };
