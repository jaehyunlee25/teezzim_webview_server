function mneCall(date, callback) {
  const param = {
    fromDate: date + "01",
    toDate: date + "31",
    calKind: date,
    currentDate: date + "01",
  };
  get("time_calendar_left.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("font_9")[0]
      .getElementsByTagName("td");
    Array.from(els).forEach((el) => {
      if (!el.getAttribute("onclick")) return;
      const param = el.getAttribute("onclick").inparen();
      dates.push([param[1], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    menunm: "membership",
    subnm: "calendar",
    pointdate: date,
    dategbn: option[2],
    openyn: "2",
    currentdate: "",
  };
  const dictCourse = {
    1: "햇님",
    2: "달님",
    3: "별님",
  };
  post("/membership/booking/time_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = doc.gcn("btn btn-success");
    els.forEach((el, i) => {
      const param = el.parentNode.attr("href").inparen();
      let [, course, time, , , , fee_normal] = param;
      course = dictCourse[course];
      fee_normal *= 1;
      const fee_discount = fee_normal;

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