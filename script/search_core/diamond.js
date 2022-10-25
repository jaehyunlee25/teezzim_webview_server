function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["__ASYNCPOST"] = "true";
  param["ctl00$contents$ScrptManager1"] =
    "ctl00$contents$ScrptManager1|ctl00$contents$btnUp";
  param["__EVENTTARGET"] = "ctl00$contents$btnUp";
  param["ctl00$contents$htbArgs"] =
    "PREV|" + (date + "01").datify() + "-01|" + (date + "01").datify();
  post("/Mobile/", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("reserved");
    Array.from(els).forEach((el) => {
      const fulldate = date + el.innerText.addzero();
      dates.push([fulldate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    11: "North",
    22: "South",
  };
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  global_param["__ASYNCPOST"] = "true";
  global_param["ctl00$contents$htbArgs"] = "INIT";
  global_param["ctl00$contents$ScptManager"] =
    "ctl00$contents$ScptManager|ctl00$contents$btnUp";
  global_param["__EVENTTARGET"] = "ctl00$contents$btnUp";
  post(
    "/Mobile/Reservation/Reservation.aspx?SelectedDate=" + date.datify(),
    global_param,
    {},
    (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const els = ifr
        .getElementsByClassName("tbl01")[1]
        .getElementsByTagName("a");
      Array.from(els).forEach((el) => {
        const param = el.getAttribute("href").inparen();
        const course = dictCourse[param[2]];
        const time = param[1];
        let fee_normal =
          el.parentNode.parentNode.children[2].innerText.getFee();
        let fee_discount =
          el.parentNode.parentNode.children[2].innerText.getFee();

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
    const param = { SelectedDate: thisdate + "01" };
    get("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
      const ifr = document.createElement("div");
      ifr.innerHTML = data;
      const ipts = ifr.getElementsByTagName("input");
      Array.from(ipts).forEach((ipt) => {
        if (!ipt.id) return;
        global_param[ipt.name] = ipt.value;
      });
      procDate();
    });
  });
});