const fs = require("fs");
const log = console.log;

const clubFrom = "adelscott";
const clubTo = "lavieestbelle_old";

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
