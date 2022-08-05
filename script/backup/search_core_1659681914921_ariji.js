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
  const dictCourse = {};
  post("/membership/booking/time_list.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const trs1 = ifr
      .getElementsByClassName("panel")[1]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    const trs2 = ifr
      .getElementsByClassName("panel")[2]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    const trs3 = ifr
      .getElementsByClassName("panel")[3]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    const els = Array.from(trs1)
      .concat(Array.from(trs2))
      .concat(Array.from(trs3));

    els.forEach((el, i) => {
      if (i === 0) return;
      const course = el.children[1].innerText;
      const time = el.children[2].innerText;
      const fee_normal = el.children[5].innerText.split(",").join("") * 1;
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;

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