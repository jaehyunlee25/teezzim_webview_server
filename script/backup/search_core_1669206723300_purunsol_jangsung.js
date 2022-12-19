function mneCall(date, callback) {
  const els = doc.gcn("sel");
  Array.from(els).forEach((el) => {
    const date = el.nm(2).attr("data-dt").rm("-");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/_AJAX/reservation/services.asmx/GetGolfTimeList";
  const method = "post";
  const param = {
    p_cos: "",
    p_date: date.datify(),
    p_golfgbn: "109",
    p_rtype: "",
  };
  const dictCourse = {
    A: "레이크",
    B: "마운틴",
    C: "힐",
  };

  fCall[method](addr, param, { "Content-Type": "application/json" }, (data) => {
    const ifr = doc.clm("table");
    ifr.innerHTML = data.jp().d.jp().html;

    const els = ifr.gba("onclick", "reserve", true);
    Array.from(els).forEach((el) => {
      let [, , date] = el.attr("onclick").inparen();
      date = date.rm("-");

      const time = el
        .nm(2, 0)
        .str()
        .regex(/[0-9]{2}:[0-9]{2}/)[0]
        .rm(":");
log("pj", time);
      course = el.nm(2, 1).str().replace(/\s/g, "").split("(")[0];
      hole = el.nm(2, 1).str().replace(/\s/g, "").split("(")[1].ct(2);
      const fee = el.nm(2, 2).str().replace(/\s/g, "").ct(1).rm(",");
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