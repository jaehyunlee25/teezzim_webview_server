function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "560",
    selYm: date,
    agcYn: "N",
    agcNum: "",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {        
    const els = JSON.parse(data).rows;
    Array.from(els).forEach((el) => {
      if(el.BK_TEAM == 0) return;
      const fulldate = el.CL_SOLAR;
      dates.push([fulldate, 0]);
    });
    callback();
  });
}
  
/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    A: "Ocean",
    B: "Valley",
    C: "Mountain",
  };
  const courses = ["A", "B", "C"];
  exec();

  function exec() {
    const cos = courses.shift();
    if(!cos) {
      procDate();
      return;
    }
    const param = {
      method: "getTeeList",
      coDiv: "560",
      date,
      cos,
    };
    post("/controller/ReservationController.asp", param, {}, (data) => {
      const els = JSON.parse(data).rows;
      Array.from(els).forEach((el, i) => {
        const course = dictCourse[el.BK_COS];
        const time = el.BK_TIME;
        let fee_normal = el.BK_B_CHARGE_NM.getFee();
        let fee_discount = el.BK_S_CHARGE_NM.getFee();
  
        if (isNaN(fee_normal)) fee_normal = -1;
        if (isNaN(fee_discount)) fee_discount = -1;
  
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
      exec();
    });
  };
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
    mneCall(nextdate, procDate);
});