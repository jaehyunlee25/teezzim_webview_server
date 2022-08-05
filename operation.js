const fs = require("fs");
const log = console.log;
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
    file,
    ["./script/reserve_core", two, club, type + ".json"].join("/"),
  ]);
});

const curClub = {};
Object.keys(clubs).forEach((key) => {
  const club = clubs[key];
  const dates = Object.keys(club);
  dates.sort((a, b) => b - a);
  log(dates);
  curClub[key] = club[dates[0]];
});
Object.keys(curClub).forEach((key) => {
  const club = clubs[key];
  const time = Object.keys(club)[0];
  //log(time);
  // log(club);
});
