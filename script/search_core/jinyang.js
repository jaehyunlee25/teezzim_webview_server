function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: 880,
    selYm: date,
  };
  get("/controller/ReservationController.asp", param, {}, (data) => {
    const arRes = JSON.parse(data).rows;
    arRes.forEach((ob) => {
      if (ob.BK_TEAM === "0") return;
      dates.push([ob.CL_SOLAR, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    method: "getTeeList",
    coDiv: 880,
    date: date,
    cos: "",
  };
  const dictCourse = {
    힐: "Hill",
    크리크: "Creek",
    밸리: "Valley",
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const arRes = JSON.parse(data).rows;
    arRes.forEach((ob) => {
      const course = dictCourse[ob.BK_COS_NM];
      const time = ob.BK_TIME.gh(2) + ":" + ob.BK_TIME.gt(2);
      const fee_normal = ob.BK_CHARGE.replace(/\,/g, "") * 1;
      const fee_discount = ob.BK_MCHARGE.replace(/\,/g, "") * 1;
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
        others: "9홀",
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
