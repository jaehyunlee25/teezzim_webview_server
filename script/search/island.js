const clubId = "6cbc1160-79af-11ec-b15c-0242ac110005";
const courses = {
  EAST: "9f0a03a5-79af-11ec-b15c-0242ac110005",
  SOUTH: "9f0a063d-79af-11ec-b15c-0242ac110005",
  WEST: "9f0a068c-79af-11ec-b15c-0242ac110005",
};
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const dates = [];
const result = [];
const golf_schedule = [];

mneCall("", procDate);

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
  const param = { book_date: date };
  post("reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const str = a.getAttribute("href");
      if (!str || str.indexOf("JavaScript:Book_") === -1) return;

      const ob = procStrDetail(str);
      const { course, time, fee_normal, fee_discount } = ob;
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
        others: "",
      });
    });
  });
}
function mneCall(date, callback) {
  const param = {};
  post("reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const str = a.getAttribute("href");
      if (!str || str.indexOf("JavaScript:Date_Click") === -1) return;
      const ob = procStr(str);
      dates.push([ob.date, 0]);
    });

    callback();
  });
}
function procStrDetail(str) {
  const regex = /Book_time\d*\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return {
    time: addColon(values[3]),
    course: values[2].replace(/\"/g, "").replace(" ", ""),
    fee_normal: values[4] * 1,
    fee_discount: values[4] * 1,
  };
}
function addColon(str) {
  return str.gh(2) + ":" + str.gt(2);
}
function procStr(str) {
  const regex = /Date_Click\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join("") };
}
