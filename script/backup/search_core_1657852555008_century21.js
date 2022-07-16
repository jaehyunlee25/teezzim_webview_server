function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  get("/mobile/reserve.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("btn btn-sm book");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      const fulldate = [param[0], param[1], param[2]].join("");
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
