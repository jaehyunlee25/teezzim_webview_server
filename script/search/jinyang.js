const clubId = "958ccc56-869e-11ec-b15c-0242ac110005";
const courses = {
  힐: "e349be93-869e-11ec-b15c-0242ac110005",
  크리크: "e349c149-869e-11ec-b15c-0242ac110005",
  밸리: "e349c19b-869e-11ec-b15c-0242ac110005",
};
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];
let callbackNumber = -1;

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});

function procDate() {
  const lmt = dates.length - 1;
  let cnt = 0;

  const timer = setInterval(() => {
    if (cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    const [date] = dates[cnt];
    console.log("수집하기", cnt + "/" + lmt, date);
    mneCallDetail(date);
    cnt++;
  }, 300);
}
function procGolfSchedule() {
  golf_schedule.forEach((obj) => {
    obj.golf_course_id = courses[obj.golf_course_id];
    obj.date =
      obj.date.gh(4) + "-" + obj.date.ch(4).gh(2) + "-" + obj.date.gt(2);
  });
  console.log(golf_schedule);
  const param = { golf_schedule, golf_club_id: clubId };
  post(addrOuter, param, header, () => {
    const ac = window.AndroidController;
    if (ac) ac.message("end of procGolfSchedule!");
  });
}
function mneCallDetail(date) {
  const param = {
    method: "getTeeList",
    coDiv: 880,
    date: date,
    cos: "",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    callbackNumber++;
    const arRes = JSON.parse(data).rows;
    arRes.forEach((ob) => {
      const course = ob.BK_COS_NM;
      const time = ob.BK_TIME.gh(2) + ":" + ob.BK_TIME.gt(2);
      const fee_normal = ob.BK_CHARGE.replace(/\,/g, "") * 1;
      const fee_discount = ob.BK_MCHARGE.replace(/\,/g, "") * 1;
      const slot = time.gh(2);
      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
      });
    });
  });
}
function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: 880,
    selYm: date,
  };
  get("/controller/ReservationController.asp", param, {}, (data) => {
    const arRes = JSON.parse(data).rows;
    arRes.forEach((ob) => {
      if (ob.BK_TEAM === "0") return;
      dates.push([ob.CL_SOLAR, 0]);
    });
    callback();
  });
}
