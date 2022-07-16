function mneCall(date, callback) {
  const param = {
    wdate: (date + "01").datify(),
    wtcode: "",
  };
  post("/_html/reserve_cal.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByTagName("tbody")[1]
      .getElementsByTagName("img");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const fulldate = param[0].split("-").join("");
      dates.push([fulldate, param]);
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
