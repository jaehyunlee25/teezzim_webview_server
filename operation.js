const fs = require("fs");
const log = console.log;

const clubFrom = "alpsdy";
const clubTo = "andonglake";

["reserve", "search", "cancel"].forEach((folder) => {
  const con = fs.readFileSync(
    "./script/reserve/" + folder + "/" + clubFrom + ".js",
    "utf-8"
  );
  fs.writeFileSync("./script/reserve/" + folder + "/" + clubTo + ".js", con);
});
log("file copy completed!!");
