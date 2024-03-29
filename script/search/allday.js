changeCoDiv("76");
setTimeout(() => {
  const clubId = "7c46fb42-c008-11ec-a93e-0242ac11000a";
  const courses = {
    Valley: "1e50afae-c00a-11ec-a93e-0242ac11000a",
    Lake: "1e50b2f1-c00a-11ec-a93e-0242ac11000a",
    Mountain: "1e50b32f-c00a-11ec-a93e-0242ac11000a",
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

  mneCall(thisdate, () => {
    doNextMonth();
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
    const [date] = arrDate;
    const param = {
      method: "getTeeList",
      coDiv: "76",
      cos: "All",
      part: "All",
      date: date,
    };
    post("/controller/ReservationController.asp", param, {}, (data) => {
      const objResp = JSON.parse(data).rows;
      const dict = { A: "Mountain", B: "Lake", C: "Valley" };
      objResp.forEach((obj) => {
        const course = dict[obj.BK_COS];
        const time = obj.BK_TIME.gh(2) + ":" + obj.BK_TIME.gt(2);
        const fee_normal = obj.BK_BASIC_CHARGE.replace(/\,/g, "") * 1;
        const fee_discount = obj.BK_CHARGE.replace(/\,/g, "") * 1;

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
    const tds = Array.from(calendarBox1.getElementsByClassName("possible"));
    tds.forEach((td) => {
      const num = td.innerText;
      const fulldate = date + num;
      dates.push([fulldate, 0]);
    });
    callback();
  }
}, 1500);
