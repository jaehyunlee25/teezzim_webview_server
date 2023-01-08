const clubId = "6cdeee13-8724-11ec-b15c-0242ac110005";
const courses = {
  동: "b37da88a-8724-11ec-b15c-0242ac110005",
  남: "b37daab0-8724-11ec-b15c-0242ac110005",
  서: "b37dab13-8724-11ec-b15c-0242ac110005",
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
    golfResType: "real",
    courseId: 0,
    courseIdM: 0,
    courseIdS: 0,
    usrMemCd: 21,
    pointDate: date,
    openYn: 1,
    dateGbn: "",
    choiceTime: "00",
    cssncourseum: "",
    inputType: "",
  };
  post("/reservation/list/ajax_real_timeinfo_list.do", param, {}, (data) => {
    callbackNumber++;
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;
      const tds = tr.children;
      const time = tds[1].innerHTML;
      const course = tds[2].innerHTML.gh(1);
      const inOut = tds[2].innerHTML;
      const fee_normal = tds[4].innerText.replace(/\,/g, "") * 1;
      const fee_discount = tds[5].innerText.replace(/\,/g, "") * 1;
      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: inOut,
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
  });
}
function mneCall(date, callback) {
  console.log(date);
  const param = {
    golfResType: "real",
    schDate: date,
    usrMemCd: "21",
    toDay: date + "01",
    calNum: 1,
    inputType: "M",
    recaptchaToken: "",
  };
  post(
    "/reservation/calendar/ajax_realtime_calendar_view.do",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const as = ifr.getElementsByTagName("a");
      Array.from(as).forEach((a) => {
        const str = a.getAttribute("href");
        if (str.indexOf("javascript:timefrom_change(") === -1) return;
        const ob = procStr(str);
        if (!ob.available) return;
        dates.push([ob.date, 0]);
      });
      callback();
    }
  );
}
function procStr(str) {
  const regex = /javascript:timefrom_change\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0], available: values[5] === "T" };
}
