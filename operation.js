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
  clubs[club][sec].push(
    ["./script/reserve_core", two, club, type + ".json"].join("/")
  );
});
log(Object.keys[clubs]);

/* Object.keys[clubs].forEach((club) => {
  const dates = Object.keys(club);
  log(dates);
}); */
