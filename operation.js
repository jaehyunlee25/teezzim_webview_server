const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const path = "./script/reserve_core/search/";
const files = fs.readdirSync(path);
let cnt = 0;
files.forEach((file, i) => {
  if (file.indexOf(".js") != -1) return;
  if (file.indexOf(".") != -1) return;
  cnt++;
  const addr = path + file + "/funcs.json";
  const con = fs.readFileSync(addr, "utf-8");
  const funcs = JSON.parse(con);

  const funcName = funcs.funcSearch ? "funcSearch" : "funcReserve";
  const lines = funcs[funcName].split("\r\n");

  log(lines);
  return;

  let flg = false;
  let chk = false;
  const before = [];
  const param = [];
  const after = [];
  lines.forEach((ln) => {
    if (ln.indexOf("if(ac)") != -1) {
      log(cnt, file, funcName);
      flg = true;
      chk = true;
    }
    if (flg) {
      param.push(ln);
    } else {
      if (chk) after.push(ln);
      else before.push(ln);
    }

    if (flg && ln.indexOf("));") != -1) flg = false;
  });

  const prm = [];
  param.forEach((ln) => {
    prm.push("    getDetail(param, (exParam) => {");
    prm.push("    " + ln.replace("param", "exParam"));
    prm.push("    }):");
  });

  funcs[funcName] = [...before, ...prm, ...after].join("\r\n");
  log(funcs[funcName]);

  fs.writeFileSync(addr, JSON.stringify(funcs), "utf-8");
});
