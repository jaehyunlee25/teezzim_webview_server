function mneCall(date, callback) {
  const param = {
    coDiv: "17",
    mType: "M",
    calDate: date + "01",
    submitDate: "",
    bkTime: "",
    bkCourse: "",
    greenFee: "",
  };
  post("/reservation/status", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("open");
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
