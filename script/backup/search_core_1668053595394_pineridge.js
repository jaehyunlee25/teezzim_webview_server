function mneCall(date, callback) {
  const els = doc.body.gba(
    "href",
    "/page/booking/golf_reservation_sh.asp",
    true
  );
  Array.from(els).forEach((el, i) => {
    const href = el.attr("href");
    const date = href.split("?")[1].split("&")[0].split("=")[1];
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/page/booking/golf_reservation_sh.asp";
  const method = "post";
  const param = {
    book_date: date.datify(),
    book_crs: "%",
    book_chapt: "%",
    sbook_chapt: "%",
  };
  const dictCourse = {
    파인: "PINE",
    리즈: "RIDGE",
    레이크: "LAKE",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:Time_Select", true);
    Array.from(els).forEach((el) => {
      let [date, sign, time, , , , hole, course, fee] = el
        .attr("onClick")
        .inparen(true);
      course = dictCourse[course];
      hole = hole.ct(1);
      fee_normal = fee.rm(",") * 1;
      fee_discount = fee.rm(",") * 1;

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
mneCall(thisdate, procDate);
