// local module
const fs = require("node:fs");

// ! FUNCTION FILE JSON
// ! AMBIL SEMUA DATA DI CONTACT.JSON
function laodContact() {
  let file = fs.readFileSync("data/dataBarang.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
}

function saveContacts(contact) {
  // ! object CONTACT ubah jadi string lalu masukan/timpah ke file contacts.json
  fs.writeFileSync("data/dataBarang.json", JSON.stringify(contact));
}

// ! menambahkan contact data baru
function addContact(contact) {
  const contacts = laodContact();
  // ! push ke variabel contacts
  contacts.push(contact);
  // ! masukan data baru ke contacts.json
  saveContacts(contacts);
}

// ! cek nama yang duplikat
function cekDuplikat(nama) {
  const contacts = laodContact();
  return contacts.find((contact) => contact.kodeBarang === nama);
}

// ! EXPORT MODULE LOCAL
module.exports = { laodContact, addContact, cekDuplikat };
