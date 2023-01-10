const clubId = "1a82280f-7a9c-11ec-b15c-0242ac110005";
const courses = {
  EAST: "4eb611d2-7a9c-11ec-b15c-0242ac110005",
  SOUTH: "4eb614bc-7a9c-11ec-b15c-0242ac110005",
  WEST: "4eb6151f-7a9c-11ec-b15c-0242ac110005",
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
    golfrestype: "T",
    courseid: 0,
    usrmemcd: 91,
    pointdate: date,
    openyn: 1,
    dategbn: 4,
    choice_time: "00",
    cssncourseum: "",
    inputtype: "Q",
  };
  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if (i === 0) return;
      const course = tr.children[1].innerText;
      const time = tr.children[2].innerText;
      const fee_normal =
        tr.children[4].children[0].innerText.replace(/,/g, "") * 1;
      const fee_discount =
        tr.children[5].children[0].innerText.replace(/,/g, "") * 1;
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
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "91",
    toDay: date + "01",
    calnum: 1,
    inputtype: "Q",
  };
  post("/GolfRes/mainpage/quick_calendar_ajax_view.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const ob = procStr(a.href);
      if (!ob) return;
      if (ob.type !== "T") return;
      dates.push([ob.date, 0]);
    });
    callback();
  });
}
function procStr(str) {
  const head = str.indexOf("quick_timefrom_change");
  if (head === -1) return false;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values[0], type: values[5] };
}
