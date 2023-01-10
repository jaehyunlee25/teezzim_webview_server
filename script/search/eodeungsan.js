const clubId = "2ec1a5c2-e3eb-11ec-a93e-0242ac11000a";
const courses = {
  어등: "47f07048-e3eb-11ec-a93e-0242ac11000a",
  송정: "47f072f0-e3eb-11ec-a93e-0242ac11000a",
  하남: "47f0732d-e3eb-11ec-a93e-0242ac11000a",
};
const OUTER_ADDR_HEADER = "https://op.mnemosyne.co.kr";
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
  /* let cnt = 0;
	const timer = setInterval(() => {
		if(cnt > lmt) {
			clearInterval(timer);
			procGolfSchedule();
			return;
		}
		const [date] = dates[cnt];
		console.log('수집하기', cnt + '/' + lmt, date);
		mneCallDetail(date);
		cnt++;
	}, 300); */
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
    book_date: date,
    book_time: "",
    book_crs: "",
    sale_div: "",
    book_crs_name: "",
  };

  post("reservation_02.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrTable = ifr.getElementsByClassName("typeB text-center mt2");
    Array.from(arrTable).forEach((table, i) => {
      const tbody = table.getElementsByTagName("tbody")[0];
      const trs = tbody.children;
      Array.from(trs).forEach((tr) => {
        if (tr.children.length < 2) return;
        const course = i === 0 ? "어등" : i === 1 ? "송정" : "하남";
        const time = tr.children[0].innerText
          .replace(/\s/g, "")
          .gh(5)
          .split(":")
          .join("");
        const fee_discount = 140000;
        const fee_normal = 140000;

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
    procDate();
  });
}
function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const tds = ifr.getElementsByClassName("book");
    Array.from(tds).forEach((td) => {
      const el = td.children[0];
      if (el.tagName != "A") return;
      const str = el.getAttribute("href");
      const vals = procHref(str);
      dates.push([vals.date, ""]);
    });
    callback();
  });
}
function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join(""), type: "" };
}
