const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/reserve_core/reserve/";
const files = fs.readdirSync(path);
files.forEach((file) => {
  if (file.indexOf(".") != -1) return;
  const addr = path + file + "/dict.json";
  const con = fs.readFileSync(addr, "utf-8");
  fs.writeFileSync("script/search_dict/" + file + ".json", con, "utf-8");
});
