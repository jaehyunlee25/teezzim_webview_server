const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/reserve_core/reserve/";
const files = fs.readdirSync(path);
files.forEach((folder, i) => {
  if (folder.indexOf(".") != -1) return;
  const con = fs.readFileSync(path + folder + "/funcs.json", "utf-8");
  const funcs = JSON.parse(con);
  log(folder, funcs["LOGOUT"]);
});
