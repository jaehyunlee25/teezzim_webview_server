function mneCall(date, callback) {
  const param = {
    method: "getCalendar",
    coDiv: "944",
    selYm: date,
  };
  post("/controller/ReservationController.asp", param, {}, (data) => {
    const els = JSON.parse(data).rows;
    Array.from(els).forEach((el) => {
      if (el.BK_TEAM === 0) return;
      dates.push([el.CL_SOLAR, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
