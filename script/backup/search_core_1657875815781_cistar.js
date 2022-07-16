function mneCall(date, callback) {
  const param = {
    V_IN_START_DATE: date + "01",
  };
  post("/proc/selectGolfCalendar.do", param, {}, (data) => {
    const els = JSON.parse(data).rows.OUT_DATA;
    Array.from(els).forEach((el) => {
      Object.keys(el).forEach((day) => {
        const val = el[day];
        if (!val) return;
        if (val.ch(4).gh(1) == "N") return;
        const fulldate = date + val.gh(2);
        dates.push([fulldate, param]);
      });
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
