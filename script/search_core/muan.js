function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    toYear: date.gh(4),
    toMonth: date.gt(2),
  };
  post("/ajax/calendar.booking.php", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "onBookingView", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("onclick").inparen();
      dates.push([date.rm('"'), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/booking/sub05_01_01.php";
  const method = "post";
  const param = {
    book: date,
  };
  const dictCourse = {
    A: "서A",
    B: "서B",
    C: "남A",
    D: "남B",
    E: "동A",
    F: "동B",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:bookTime", true);
    Array.from(els).forEach((el) => {
      let [str] = el.attr("href").inparen();
      str = str.rm('"');
      const time = str.gh(4);
      course = dictCourse[str.ch(4).gh(1)];
      hole = 18;
      const fee = 90000;
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