function mneCall(date, callback) {
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ScrptManager1"] = "ScrptManager1|btnUp";
  param["htbArgs"] =
    "|" + (date + "01").datify() + "|" + (date + "01").datify();
  param["__EVENTTARGET"] = "btnUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "javascript:Reserve", true);
    Array.from(els).forEach((el) => {
      const [, date, sign] = el.attr(attr).inparen();
      if (sign == "0") return;
      dates.push([date.rm("-"), sign]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Reservation/ReservationTimeList.aspx";
  const method = "post";

  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["Choice_Date"] = date.datify();
  param["Day_Gubun"] = sign;
  param["htbArgs"] = "|" + date.datify() + "|" + date.datify();

  const dictCourse = {
    11: "서코스",
    22: "남코스",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:ReserveCheck", true);
    Array.from(els).forEach((el) => {
      let [date, course, time, , , hole, , , fee] = el.attr(attr).inparen();
      course = dictCourse[course];
      fee *= 1;
      fee_normal = fee;
      fee_discount = fee;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole + "홀",
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});