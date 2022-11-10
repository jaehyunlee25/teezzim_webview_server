function mneCall(date, callback) {
  const els = doc.gcn("book");
  Array.from(els).forEach((el) => {
    if(!el.attr("onclick")) return;
    const [year, month, date] = el.attr("onclick").inparen();
    const dt = [year, month, date].join("");
    dates.push([dt, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    book_date_bd: date,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    1: "단일",
  };

  post("/mobile/reserve_step1.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("book");
    Array.from(els).forEach((el) => {
      let [date, course, time] = el.attr("onclick").inparen();
      const hole = "9홀";
      course = dictCourse[course];
      const fee_normal = 65000;
      const fee_discount = 65000;

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