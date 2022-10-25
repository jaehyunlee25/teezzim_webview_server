function mneCall(date, callback) {
  const els = doc.gcn("calendar")[0].gtn("a");
  Array.from(els).forEach((el) => {
    if (el.str() == "예약불가") return;
    const param = el.attr("href").inparen();
    const [fulldate] = param;
    dates.push([fulldate.rm("-"), 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    1: "단일",
  };

  const param = {
    Choice_Date: date.datify(),
    Day_Gubun: "",
    Day_Course: "00",
  };
  post("/reserve/Reserve_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("stats");
    Array.from(els).forEach((el) => {
      const time = el.children[0].attr("href").inparen()[1];
      const course = dictCourse[1];
      const hole = el.parentNode.children[1].str();
      fee_discount = hole == "9홀" ? 40000 : 80000;
      fee_normal = hole == "9홀" ? 40000 : 80000;

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
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);