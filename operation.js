const fs = require("fs");
const log = console.log;

const clubFrom = "vivaldi_east";
const clubTo = "vivaldi_west";

["reserve", "search", "cancel"].forEach((folder) => {
  const newName = "./script/reserve/" + folder + "/" + clubTo + ".js";
  if (fs.existsSync(newName)) return;
  const con = fs.readFileSync(
    "./script/reserve/" + folder + "/" + clubFrom + ".js",
    "utf-8"
  );
  fs.writeFileSync(newName, con);
});
log("file copy completed!!");
