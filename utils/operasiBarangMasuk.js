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

// ! mencari dataBarang
function findContact(kdBarang) {
  const dataBarangMasuk = laodContact();
  // ! jika kodeBarang sama akan mengembalikan object
  // ! method find ga mengembalikan array baru
  const dataBarang = dataBarangMasuk.find((barang) => {
    return barang.kodeBarang === kdBarang;
  });
  return dataBarang;
}

// ! menghapus dataBarang
function deleteContact(kodeBarang) {
  const dataBarangMasukJson = laodContact();
  // ! variabel filterContact mengembalikan array baru
  let filterContact = dataBarangMasukJson.filter((barang) => {
    return barang.kodeBarang !== kodeBarang;
  });
  // ! masukan data baru ke file dataBarang.json
  saveContacts(filterContact);
  console.log(filterContact);
}

// ! EXPORT MODULE LOCAL
module.exports = {
  laodContact,
  addContact,
  cekDuplikat,
  findContact,
  deleteContact,
};
