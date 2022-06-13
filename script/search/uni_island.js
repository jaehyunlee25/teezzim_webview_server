const clubId = "1502b62e-85a9-11ec-b15c-0242ac110005";
const courses = {
  IN: "37cd7dc5-85a9-11ec-b15c-0242ac110005",
  OUT: "37cd8023-85a9-11ec-b15c-0242ac110005",
};
const OUTER_ADDR_HEADER = "https://dev.mnemosyne.co.kr";
const addrOuter = OUTER_ADDR_HEADER + "/api/reservation/golfSchedule";
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + "/" + thismonth + "/01";
console.log(thisdate);

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
  Update(
    "CALENDAR|" + nextdate.gh(4) + "-" + nextdate.ch(4).gh(2) + "-" + "01|"
  );
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 3000);
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
    const arrDate = dates[cnt];
    console.log("수집하기", cnt + "/" + lmt, arrDate[0]);
    mneCallDetail(arrDate);
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
function mneCallDetail(arrDate) {
  const [date, strParam] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$htbArgs"] = strParam;
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btUp";

  post("Reservation.aspx?choiceGolf=160", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbl = ifr.getElementsByClassName("timeTbl")[0];
    const els = tbl.getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (i === 0) return;

      const course = el.children[0].innerText;
      const time = el.children[1].innerText;
      const fee_normal = el.children[3].innerText.ct(1).split(",").join("") * 1;
      const fee_discount =
        el.children[4].innerText.ct(1).split(",").join("") * 1;
      const caddy = el.children[2].innerText;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀/" + caddy,
      });
    });
  });
}
function mneCall(date, callback) {
  const els = document.getElementsByTagName("a");
  Array.from(els).forEach((el) => {
    const obj = procHref(el.href.toString());
    if (obj === undefined) return;
    dates.push([obj.date, obj.param]);
  });
  callback();
}
function procHref(str) {
  if (str.indexOf("javascript:Update('LIST") === -1) return;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: str.split("|")[2].split("-").join(""), param: values[0] };
}
