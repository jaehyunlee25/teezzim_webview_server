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

  log(funcs[funcName]);
  return;

  let flg = false;
  let chk = false;
  const before = [];
  const param = [];
  const after = [];
  lines.forEach((ln) => {
    if (ln.indexOf("const addr = OUTER_ADDR_HEADER") != -1) {
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

    if (flg && ln.trim() == "});") flg = false;
  });

  if (param[0].indexOf("/*") == -1) {
    param.unshift("    /*");
    param.push("    */");
    param.unshift("    if(ac) ac.message(JSON.stringify(param));");
  } else {
  }

  funcs[funcName] = [...before, ...param, ...after].join("\r\n");
  log(funcs[funcName]);

  //fs.writeFileSync(addr, JSON.stringify(funcs), "utf-8");
});
