const clubId = "cfc14d07-ce11-11ec-a93e-0242ac11000a";
const courses = {
  올림푸스: "2b44b229-ce12-11ec-a93e-0242ac11000a",
  타이탄: "2b44b44e-ce12-11ec-a93e-0242ac11000a",
  마이다스: "2b44b489-ce12-11ec-a93e-0242ac11000a",
};
const OUTER_ADDR_HEADER = "https://op.mnemosyne.co.kr";
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

setTimeout(() => {
  mneCall(thisdate, procDate);
}, 1000);

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
    lgubun: "113",
    date: date,
    changeDate: "",
    changeSeq: "",
  };
  post("/Reservation/AjaxTimeList", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;

      const course = tr.getAttribute("data-coursekor");
      const time = tr.children[1].innerHTML;
      const fee_normal = tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
      const fee_discount =
        tr.children[2].innerHTML.ct(1).replace(/\,/g, "") * 1;
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
  const atds = document.getElementsByTagName("td");
  const tds = [];
  Array.from(atds).forEach((td) => {
    const tee = td.getAttribute("data-cnt");
    if (!tee || tee == 0) return;
    tds.push(td);
  });

  tds.forEach((td) => {
    const strDate = td.getAttribute("data-day");
    dates.push([strDate, 0]);
  });

  callback();
}
