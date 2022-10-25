function mneCall(date, callback) {
  timer(2000, () => {
    const param = {
      V_IN_GOLF_ID: "S1",
      V_IN_YEAR: date.gh(4),
      V_IN_MONTH: date.gt(2),
      V_IN_MEMNO: "",
      T_MONTH: date.gt(2),
    };
    post("/golf.calendar.pns?getCalendar_S1", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        if (el.IT_OPEN != "신청하기") return;
        const fulldate = el.ORI_CD_DATE.split("-").join("");
        dates.push([fulldate, 0]);
      });
      callback();
    });
  });  
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    I: "In",
    O: "Out",
  };
  const arr = ["I", "O"];

  exec();

  function exec() {
    const courseCode = arr.shift();
    if (!courseCode) {
      procDate();
      return;
    }

    const param = {
      V_IN_GOLF_ID: "S1",
      V_IN_DATE: date.datify(),
      V_IN_COURSE: "O",
      V_IN_ROUND_TYPE: "4",
      ID_REF_CD: "",
      V_IN_MEMNO: "",
    };
    post("/golf.course.pns?getCourse_G", param, {}, (data) => {
      const els = JSON.parse(data).entitys;
      Array.from(els).forEach((el) => {
        const time = el.r_TIME.rm(":");
        const course = dictCourse[courseCode];
        fee_discount = el.ACT_GREENFEE * 1;
        fee_normal = el.ACT_GREENFEE * 1;
  
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
      exec();
    });
  }  
}

/* <============line_div==========> */
function funcCalendar() {
  S1.click();
}
/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});