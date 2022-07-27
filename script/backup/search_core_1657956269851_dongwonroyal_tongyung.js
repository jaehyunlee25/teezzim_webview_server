function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    resetcode: "H62",
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
      const els = ifr.getElementsByClassName("cm_liv");
      Array.from(els).forEach((el) => {
        const param = el
          .getElementsByTagName("a")[0]
          .getAttribute("href")
          .inparen();
        dates.push([param[0], param]);
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
