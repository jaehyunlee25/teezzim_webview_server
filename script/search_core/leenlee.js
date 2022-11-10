function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "javascript:booking_real", true);
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("onclick").inparen();
    dates.push([date, sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    gm_ymd: date,
  };
  post("/mobile_web/reservation/reservation01_02_re.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const dictCourse = {
      10: "Lake",
      20: "Highland",
      30: "Sky",
    };
    const els = ifr.gba("href", "javascript:booking_insert_request", true);
    Array.from(els).forEach((el) => {
      let [date, course, time] = el.attr("href").inparen();
      course = dictCourse[course];
      const hole = "18홀";
      const fee_discount = 180000;
      const fee_normal = 180000;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);