${commonScript}
const logParam = {
  type: "command",
  sub_type: "reserve/reserve",
  device_id: "${deviceId}",
  device_token: "${deviceToken}",
  golf_club_id: "${golfClubId}",
  message: "start reserve/reserve",
  parameter: JSON.stringify({}),
};
const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = {"#": "?", "?": "#"};
let addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr);
    
const year = "${year}";
const month = "${month}";
const date = "${date}";
const course = "${course}";
const time = "${time}";
const dict = ${address_mapping};

const func = dict[addr];
const dictCourse = ${reserve_course_mapping};
const splitterDate = "${splitter_date}";
const fulldate = [year, month, date].join(splitterDate);

function funcLogin() {
  log("funcLogin");
  
  const tag = localStorage.getItem("TZ_LOGIN");
  if (tag && new Date().getTime() - tag < 1000 * 5) return;
  localStorage.setItem("TZ_LOGIN", new Date().getTime());

  ${loginScript}

  return;
}