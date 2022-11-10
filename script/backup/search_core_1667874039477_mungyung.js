function mneCall(date, callback) {
  const param = {};
  const num = date == thisdate ? 1 : 2;
  post(
    "/mobile/reservation/calendar.asp?cal_month=" +
      num +
      "&course=&selectPackage=",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gba("onclick", "javascript:transDate", true);
      Array.from(els).forEach((el) => {
        const [date] = el.attr("onclick").inparen();
        dates.push([date, ""]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/mobile/reservation/golf-reservation02.asp";
  const method = "post";
  const param = {
    submitDate: date,
    submitCourse: "",
    selectPackage: "",
  };
  const dictCourse = {
    A: "문희",
    B: "경서",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .gba("class", "tab1_content")[0]
      .gba("href", "JavaScript:onclick=bookProsecc", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, fee] = el.attr("href").inparen();
      course = dictCourse[course];
      const fee_normal = fee * 1000;
      const fee_discount = fee * 1000;

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
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});