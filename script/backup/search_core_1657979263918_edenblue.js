function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "10",
    toDay: "",
    calnum: "1",
  };
  post(
    "/_mobile/GolfRes/onepage/real_calendar_ajax_view.asp",
    param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr.getElementsByClassName("cal_live");
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("href").inparen();
        const fulldate = param[0].split("-").join("");
        dates.push([fulldate, param]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});