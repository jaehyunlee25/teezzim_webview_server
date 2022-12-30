function mneCall(date, callback) {
  const attr = "onclick";
  const els = doc.gba(attr, "location.href='/Mobile/Booking/TimeList", true);
  Array.from(els).forEach((el) => {
    const { day: date } = el.attr(attr).gup();
    dates.push([date.rm("'"), el.attr(attr)]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Mobile/Booking/TimeList";
  const method = "get";
  const param = {
    day: date,
  };
  const dictCourse = {
    1: "동",
    2: "중",
    3: "서",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "ReservationForm", true);
    Array.from(els).forEach((el) => {
      const tr = el.nm(2);
      let idx;
      Array.from(tr.children).forEach((td, i) => {
        if (td == el.nm(1)) idx = i;
      });
      const time = tr.children[idx - 1].str().rm(":");
      course = idx < 2 ? 1 : idx < 4 ? 2 : 3;
      course = dictCourse[course];
      const hole = 18;
      const fee = 150000;
      const fee_normal = fee;
      const fee_discount = fee;

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