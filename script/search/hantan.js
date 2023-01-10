const clubId = "ec274d45-cdb9-11ec-a93e-0242ac11000a";
const courses = {
  밸리: "1a6b7cd7-cdba-11ec-a93e-0242ac11000a",
  마운틴: "1a6b7ec5-cdba-11ec-a93e-0242ac11000a",
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

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
  get("reservation_01.asp", { book_yymm: "202206" }, {}, (data) => {
    document.body.innerHTML = data;
    mneCall(nextdate, procDate);
  });
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
    book_date: date,
    book_yymm: date.ct(2),
  };
  post("/html/reservation/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr
      .getElementsByClassName("reserve_info")[0]
      .getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i < 2) return;

      const course = tr.children[1].innerHTML.replace(/\s/g, "");
      const time = tr.children[2].innerHTML;
      const fee_normal = tr.children[4].innerText.replace(/\,/g, "") * 1;
      const fee_discount = tr.children[4].innerText.replace(/\,/g, "") * 1;

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
  const aas = document.getElementsByTagName("a");
  const as = [];
  Array.from(aas).forEach((a) => {
    const tee = a.getAttribute("href");
    if (!tee || tee.indexOf("JavaScript:Date_Click") === -1) return;
    as.push(tee);
  });
  as.forEach((tee) => {
    const strDate = tee.split("'")[1];
    dates.push([strDate, 0]);
  });
  callback();
}
