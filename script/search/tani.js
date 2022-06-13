const clubId = "b0ed2419-e3e4-11ec-a93e-0242ac11000a";
const courses = {
  청룡: "e6eeccf1-e3e4-11ec-a93e-0242ac11000a",
  현무: "e6eecf39-e3e4-11ec-a93e-0242ac11000a",
  주작: "e6eecf7c-e3e4-11ec-a93e-0242ac11000a",
  백호: "e6eecfaa-e3e4-11ec-a93e-0242ac11000a",
};
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];
let lmt;

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});

function procDate() {
  if (lmt === undefined) lmt = dates.length - 1;
  const order = lmt - dates.length + 1;
  const arrDate = dates.shift();
  if (arrDate) {
    console.log("수집하기", order + "/" + lmt, arrDate[0]);
    mneCallDetail(arrDate);
  } else {
    procGolfSchedule();
  }
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
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;

  const param = {
    strYY: date.gh(4),
    strMM: date.ch(4).gh(2) * 1,
    strReserveType: "1",
    strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: "2",
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "1",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCode: "",
    strChangeHole: "",
  };

  post("ReservationTimeList.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const table = ifr.getElementsByClassName("tbl_reserlist")[0];
    const tbody = table.getElementsByTagName("tbody")[0];
    const trs = tbody.children;
    Array.from(trs).forEach((tr) => {
      const course = tr.children[0].innerText.replace(/\s/g, "");
      if (!course) return;
      const time = tr.children[2].innerText
        .replace(/\s/g, "")
        .gh(5)
        .split(":")
        .join("");
      const fee_discount =
        tr.children[3].innerText.replace(/\s/g, "").ct(4).split(",").join("") *
        1;
      const fee_normal =
        tr.children[3].innerText.replace(/\s/g, "").ct(4).split(",").join("") *
        1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
    procDate();
  });
}
function mneCall(date, callback) {
  const param = {
    strYY: date.gh(4),
    strMM: date.ch(4).gh(2) * 1,
    strReserveType: "1",
    strReserveDate: "",
    strReserveTime: "",
    strCourseCode: "",
    strDayGubun: "",
    strHole: "",
    strSeq: "",
    strBu: "",
    strTotalCnt: "",
    strPrevDL: "",
    strPrevTD: "",
    strPrevReserveType: "",
    dtmChangeDate: "",
    strChangeTime: "",
    strChangeSeq: "",
    strChangeDayGubun: "",
    strChangeCode: "",
    strChangeHole: "",
  };
  post("Reservation.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const spans = ifr.getElementsByClassName("choice");
    Array.from(spans).forEach((span) => {
      const el = span.children[0];
      if (el.tagName != "A") return;
      const str = el.getAttribute("href");
      const vals = procHref(str);
      log(vals.date.charCodeAt(0));
      dates.push([vals.date.ch(1), ""]);
    });
    log(dates);
    callback();
  });
}
function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[1].split("-").join(""), type: "" };
}
