function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "Date_Click", true);
  Array.from(els).forEach((el) => {
    let [date] = el.attr("onclick").inparen();
    dates.push([date.rm("-"), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/muser/booking/ajax_course_list";
  const method = "post";
  const param = {
    book_date: date.datify(),
    phon_kb: "",
    app_key: "",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "JavaScript:f_book_info", true);
    Array.from(els).forEach((el) => {
      let [date, course, , time, , fee, , hole] = el.attr("onClick").inparen();
      course = dictCourse[course];
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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