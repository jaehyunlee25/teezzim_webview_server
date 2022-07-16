function mneCall(date, callback) {
  const param = {
    coGubun: "M",
    day: [date.gh(4), date.gh(2), "01"].join("/"),
    type: "next",
  };
  post("/Mobile/Ajax/MobileCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("sel");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      dates.push([param[0], param]);
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
