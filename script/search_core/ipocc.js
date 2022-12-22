function mneCall(date, callback) {
  const attr = "class";
  const els = doc.gba(attr, "cal");
  Array.from(els).forEach((el) => {
    if (el.str() != "예약") return;
    const date = el.nm(1).attr("name");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/uss/umt/sub04_1_sub.do";
  const method = "post";
  const param = {
    datetime: date,
  };
  const dictCourse = {
    1: "Out",
    2: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "onclick";
    const els = ifr.gba(attr, "timeselect", true);
    Array.from(els).forEach((el) => {
      let [course, , , date, time] = el.attr(attr).inparen();
      const hole = 18;
      course = dictCourse[course];
      const fee_normal = 220000;
      const fee_discount = 220000;

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