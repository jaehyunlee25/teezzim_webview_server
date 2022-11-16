function mneCall(date, callback) {
  const els = doc.body.gba("href", "./m_reservation04.php?type=1", true);
  Array.from(els).forEach((el) => {
    const [, , date] = el.attr("href").split("=");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_reservation/m_reservation04.php";
  const method = "get";
  const param = {
    type: "1",
    date: date,
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "LoadData", true);
    Array.from(els).forEach((el) => {
      let [date, time] = el.attr("onclick").inparen(true);
      course = dictCourse[11];
      time = time.rm(":");
      hole = el.nm(2, 3, 0).value;
      fee_normal = 90000;
      fee_discount = 90000;

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
