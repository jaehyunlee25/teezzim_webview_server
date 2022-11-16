function mneCall(date, callback) {
  const els = doc.body.gba("href", "resv_apply.asp?pointdate=", true);
  Array.from(els).forEach((el) => {
    const date = el.attr("data-date");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/m/reservation/resv_apply.asp";
  const method = "post";
  const param = {
    pointdate: date,
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("class", "resv_btn dev-btn-apply");
    Array.from(els).forEach((el) => {
      const td = el.nm(1);
      const time = td.attr("data-bookg-time");
      course = dictCourse[11];
      hole = td.nm(1, 2).str().gh(2);
      fee_normal = 0;
      fee_discount = 0;

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
