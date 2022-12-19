function mneCall(date, callback) {
  const els = doc.body.gba("href", "/reservation_choice.jsp?", true);
  Array.from(els).forEach((el) => {
    let { submitDate: date } = el.attr("href").gup();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/reservation_choice.jsp";
  const method = "get";
  const param = {
    submitDate: date,
  };
  const dictCourse = {
    A: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "fn_rev", true);
    Array.from(els).forEach((el) => {
      let [time, date, course] = el.attr("onclick").inparen();
      course = dictCourse[course];
      const hole = el.nm(2, 3).str().replace(/\s/g, "").ct(1);
      const fee = 0;
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
