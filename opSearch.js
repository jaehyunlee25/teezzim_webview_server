const fs = require("fs");
const { isFunction } = require("lodash");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const clubName = "gumi";
const pathDict = "./script/search_dict/";
const pathLogout = "./script/search_logout/";

const conDict = fs.readFileSync(pathDict + "golfclubq.json", "utf-8");
const conLogout = fs.readFileSync(pathLogout + "golfclubq.json", "utf-8");

const jsonDict = JSON.parse(conDict);

jsonDict[0][1] = "https://www.gumicc.com/Mobile/Member/LogIn.aspx"; //login_url
jsonDict[1][1] = "https://www.gumicc.com/Mobile/Booking/GolfCalendar.aspx"; //search_url
const strLogout = "https://www.gumicc.com/Mobile/Member/LogOut.aspx"; //logout_url

const jsonLogout = JSON.parse(conLogout);
const arLogout = jsonLogout.LOGOUT.split("\r\n");
arLogout[2] = '    location.href="' + strLogout + '"';
jsonLogout.LOGOUT = arLogout.join("\r\n");

log(JSON.stringify(jsonDict));
log(JSON.stringify(jsonLogout));

fs.writeFileSync(
  pathDict + clubName + ".json",
  JSON.stringify(jsonDict),
  "utf-8"
);
fs.writeFileSync(
  pathLogout + clubName + ".json",
  JSON.stringify(jsonLogout),
  "utf-8"
);
