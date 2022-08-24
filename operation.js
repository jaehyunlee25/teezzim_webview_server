const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/login/";
const files = fs.readdirSync(path);
log(files.length);
