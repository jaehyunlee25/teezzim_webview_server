function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "NEXT|" + [date.gh(4), date.gt(2), "01"].join("-") + "|";
  post("/Mobile/", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      const fulldate = date + el.innerText.addzero();
      dates.push([fulldate, param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  global_param["__ASYNCPOST"] = "true";
  global_param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btnUp";
  global_param["ctl00$ContentPlaceHolder1$ScptManager"] =
    "ctl00$ContentPlaceHolder1$ScptManager|ctl00$ContentPlaceHolder1$btnUp";
  global_param["ctl00$ContentPlaceHolder1$htbArgs"] = "INIT";
  const dictCourse = {};
  post(
    "/Mobile/Reservation/Reservation.aspx?SelDate=" + date.datify(),
    global_param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;

      const els = ifr
        .getElementsByClassName("timeTbl")[1]
        .getElementsByTagName("tr");

      Array.from(els).forEach((el, i) => {
        const course = el.children[0].innerText.ct(2);
        const time = el.children[1].innerText;
        let fee_normal = el.children[3].innerText.split(",").join("") * 1;
        let fee_discount = el.children[3].innerText.split(",").join("") * 1;

        if (isNaN(fee_normal)) fee_normal = -1;
        if (isNaN(fee_discount)) fee_discount = -1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "18홀",
        });
      });
      procDate();
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, () => {
    const param = { SelDate: thisdate + "01" };
    get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
        const ifr = document.createElement("div");
        ifr.innerHTML = data;
        const ipts = ifr.getElementsByTagName("input");
        Array.from(ipts).forEach(ipt => {
            if(!ipt.id) return;
            global_param[ipt.name] = ipt.value;
        });
        procDate();
    });
  });
});
