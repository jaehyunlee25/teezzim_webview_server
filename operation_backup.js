const fs = require("fs");
const log = console.log;
const dir = console.dir;
String.prototype.ct = function (num) {
  return this.substring(0, this.length - num);
};

const clubs = {};
const files = fs.readdirSync("./script/backup/");
files.forEach((file) => {
  if (file.indexOf("reserve_search") == -1) return;
  let [one, two, type, time, ...club] = file.split("_");
  club = club.join("_").split(".")[0];
  if (!clubs[club]) clubs[club] = {};
  const sec = time.ct(3);
  if (!clubs[club][sec]) clubs[club][sec] = [];
  clubs[club][sec].push([
    "./script/backup/" + file,
    ["./script/reserve_core", two, club, type + ".json"].join("/"),
  ]);
});

const curClub = {};
let gochang;
Object.keys(clubs).forEach((key) => {
  if (key != "gochang") return;
  const club = clubs[key];
  gochang = club;
  const dates = Object.keys(club);
  dates.sort((a, b) => b - a);
  if (!curClub[key]) curClub[key] = {};
  curClub[key][dates[0]] = club[dates[0]];
});

const times = {};
Object.keys(gochang).forEach((time) => {
  if (!times[time]) times[time] = [];
  times[time].push(gochang[time]);
});
dir(times);
log(times["1659684711"]);

times["1659684711"][0].forEach((file) => {
  const con = fs.readFileSync(file[0], "utf-8");
  log(con);
  fs.writeFileSync(file[1], con, "utf-8");
});

/* Object.keys(curClub).forEach((key) => {
  const club = curClub[key];
  const date = Object.keys(club)[0];
  const files = club[date];
  files.forEach((file) => {
    const con = fs.readFileSync(file[0], "utf-8");
    fs.writeFileSync(file[1], con, "utf-8");
  });
}); */
