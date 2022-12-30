function mneCall(date, callback) {
  const param = {};
  get("/booking", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "javascript:", true);
    Array.from(els).forEach((el) => {
      const date = el.attr("data-date");
      if (!date) return;
      log(date);
      if (el.str().indexOf("예약") == -1) return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/booking/time/" + date;
  const method = "get";
  const param = {};
  const dictCourse = {
    A: "Out",
    B: "In",
  };

  fCall[method](addr, param, {}, (data) => {
    const els = data.jp();
    Array.from(els).forEach((el) => {
      let {
        bk_time: time,
        bk_hole: hole,
        bk_base_greenfee: fee_normal,
        bk_green_fee: fee_discount,
        bk_cours: course,
      } = el;
      course = dictCourse[course];
      fee_normal = fee_normal.rm(",") * 1;
      fee_discount = fee_discount.rm(",") * 1;

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