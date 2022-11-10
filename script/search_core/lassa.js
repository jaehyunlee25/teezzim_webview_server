function mneCall(date, callback) {
  const param = {
    method: "getCalendarMobile",
    coDiv: "860",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == "0") return;
      dates.push([el.CL_SOLAR, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: "860",
    date: date,
    cos: "",
  };
  const dictCourse = {
    A: "마운틴",
    B: "레이크",
    C: "밸리",
  };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = data.jp();
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_COS: course,
        BK_CHARGE: fee,
        BK_ROUNDF_NM: hole,
      } = el;
      course = dictCourse[course];
      hole = hole + "홀";
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;
      /*log(date, time, course, hole, fee_normal, fee_discount);*/

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
