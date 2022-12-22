function mneCall(date, callback) {
  const param = {
    coGubun: "M",
    day: (date + "01").datify("/"),
    type: "",
    calendarGubun: "",
  };
  post("/Mobile/Ajax/MobileCalendar", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "javascript:reservation", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr(attr).inparen();
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Mobile/Booking/SelectTime";
  const method = "post";
  const param = {
    coGubun: "M",
    date: date,
    type: "reserv",
    chg_date: "",
    chg_seq: "",
    chg_time: "",
    chg_course: "",
  };
  const dictCourse = {
    1: "West",
    2: "East",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "ReservationForm", true);
    Array.from(els).forEach((el) => {
      const [, tdTime, tdFee] = el.nm(2).children;
      const time = tdTime
        .str()
        .regex(/[0-9]{2}:[0-9]{2}/)[0]
        .rm(":");
      const hole = 18;
      course = dictCourse[1];
      const fee_normal = tdFee.children[0].str().rm(",") * 1;
      const fee_discount = tdFee.innerText.split("\n")[1].rm(",") * 1;

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