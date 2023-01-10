const clubId = "ef2fd07b-cd84-11ec-a93e-0242ac11000a";
const courses = {
  OUT: "9be04c31-cd86-11ec-a93e-0242ac11000a",
  IN: "9be04e72-cd86-11ec-a93e-0242ac11000a",
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
    fRsvD: date,
    fJiyukCd: "60",
    fStoreCd: 2500,
  };

  post("/m.rsv.selectMobileRsvStepOne.dp/dmparse.dm", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrDiv = ifr.getElementsByClassName("grid-content-container");
    Array.from(arrDiv).forEach((el) => {
      const course = el.children[1].innerText.replace(/\s/g, "");
      const time = el.children[0].innerText
        .replace(/\s/g, "")
        .ct(1)
        .split("시")
        .join("");
      const fee_discount =
        el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;
      const fee_normal =
        el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: course,
      });
    });
  });
}
function mneCall(date, callback) {
  Array.from(mabari.children).forEach((el) => {
    const date = el.children[0].getAttribute("data-date");
    const sign = el.children[2].innerText;
    if (sign != "예약") return;
    dates.push([date, ""]);
  });

  callback();
}
