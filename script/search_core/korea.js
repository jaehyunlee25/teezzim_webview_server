function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "612",
    selYm: date,
    msNum: "",
    msDivision: "21",
    msClass: "10",
    msLevel: "00",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM == 0) return;
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
    coDiv: "612",
    date: date,
    cos: "All",
    part: "1",
    msNum: "",
    msDivision: "21",
    msClass: "10",
    msLevel: "00",
  };
  const dictCourse = {
    A: "LAKE",
    B: "CHALLENGE",
    C: "CREEK",
  };

  post("/controller/ReservationController.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.rows;
    Array.from(els).forEach((el) => {
      let {
        BK_DAY: date,
        BK_TIME: time,
        BK_ROUNDF_NM: hole,
        BK_B_CHARGE_NM: fee_normal,
        BK_S_CHARGE_NM: fee_discount,
        BK_COS: course,
      } = el;
      course = dictCourse[course];
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
