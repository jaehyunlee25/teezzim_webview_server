const mysql = require("mysql");
const fs = require("fs");
const log = console.log;
String.prototype.gf = function () {
  const path = this.toString();
  return fs.readFileSync(path, "utf-8");
};
String.prototype.query = function (callback) {
  try {
    const sql = this.toString();
    const dbconf = "./temp/db.json";
    const connection = mysql.createConnection(dbconf.gfjp());
    connection.connect();
    connection.query(sql, callback);
    connection.end();
  } catch (e) {
    console.error(e);
  }
};
String.prototype.gfjp = function () {
  return this.toString().gf().jp();
};
String.prototype.jp = function () {
  return JSON.parse(this);
};

const files = {};
const list = fs.readdirSync("./script/search_logout/");
list.forEach((name) => {
  //files[name] = true;
});
//log(list);

"./temp/sql/test.sql".gf().query((err, rows, fields) => {
  proc(rows);
});

function proc(rows) {
  rows.forEach((row) => {
    if (!row.login_url || !row.search_url) return;
    if (files[row.eng_id + ".json"]) {
      // log(row.eng_id);
    } else {
      const obj = "./script/search_logout/gumi.json".gfjp();
      log(obj);
      fs.writeFileSync(
        "./script/search_logout/" + row.eng_id + ".json",
        JSON.stringify(obj),
        "utf-8"
      );
    }
  });
}
