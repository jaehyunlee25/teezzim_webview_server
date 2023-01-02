const fs = require("fs");
const log = console.log;
const dir = console.dir;

String.prototype.gt = function (num) {
  return this.substring(this.length - num, this.length);
};
String.prototype.gh = function (num) {
  return this.substring(0, num);
};
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};
String.prototype.ch = function (num) {
  return this.substring(num, this.length);
};
String.prototype.gf = function () {
  const path = this.toString();
  return fs.readFileSync(path, "utf-8");
};
String.prototype.regex = function (re) {
  return re.exec(this);
};
String.prototype.has = function (str) {
  if (this.indexOf(str) == -1) return false;
  return true;
};
String.prototype.wf = function (file) {
  // write file
  fs.writeFileSync(file, this.toString(), "utf-8");
};
String.prototype.dp = function (param) {
  let self = this;
  const keys = Object.keys(param);
  keys.forEach((key) => {
    const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
    const val = param[key];
    self = self.replace(regex, val);
  });
  return self;
};
String.prototype.gfdp = function (param) {
  return this.toString().gf().dp(param);
};
String.prototype.add = function add(str) {
  return [this, str].join("");
};

const path = "./script/login/";

const files = fs.readdirSync(path);
const res = [];
files.forEach((file, i) => {
  if (file.has("namchon")) return;

  const con = (path + file).gf();
  if (con.trim().length == 0) return;
  if (con.has("tLoginCount")) return;
  // log(i, file);
  let str;
  con.split("\n").forEach((ln, j) => {
    if (j > 0) return;
    // res.push([i, file, ln, ln.trim().regex(/.+\./g)[0]].join(" "));
    const elLoginId = ln.trim().regex(/.+\./g)[0];
    if (elLoginId.has("doc") || elLoginId.has("window")) {
    } else {
      str = `!window["${elLoginId.ct(1)}"]`;
    }
  });
  const templ = "opLoginResult.js".gfdp({
    escapeCondition: str,
    loginScript: con,
  });
  log(i, file);
  log(templ);
  log("");
});
// fs.writeFileSync("opLoginResult", res.join("\n"));
