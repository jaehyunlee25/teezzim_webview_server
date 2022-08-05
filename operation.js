const fs = require("fs");
const log = console.log;

const clubs = {};
const files = fs.readdirSync("./script/backup/");
files.forEach((file) => {
  if (file.indexOf("reserve_search") == -1) return;
  let [one, two, type, time, ...club] = file.split("_");
  club = club.join("_").split(".")[0];
  if (!clubs[club]) clubs[club] = {};
  if (!clubs[club][time]) clubs[club][time] = [];
  clubs[club][time].push(file);
});
log(clubs);
