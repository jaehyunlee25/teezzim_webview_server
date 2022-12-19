function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    holidayType: "W",
    nowStD: (date + "01").datify(),
    nowEnD: (date + "31").datify(),
  };
  post("/web/function/internetReservationAjax.do", param, {}, (data) => {
    const json = data.jp();
    const els = json.reservationList;
    Array.from(els).forEach((el) => {
      const { GM_DATE: date, teamCount: opt } = el;
      if (opt == 0) return;
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/web/function/internetReservationListAjax.do";
  const method = "post";
  const param = {
    GM_DATE: date.datify(),
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "pf_selectMember", true);
    Array.from(els).forEach((el) => {
      let [, , , date, time, hole] = el.attr("onclick").inparen(true);
      date = date.rm("-");
      time = time.rm(":");
      hole = hole.ct(1);
      course = dictCourse[1];
      const fee = el.nm(2, 2).str().replace(/\s/g, "").ct(1).rm(",") * 1;
      fee_normal = fee;
      fee_discount = fee;

      let flg = true;
      golf_schedule.forEach((ob) => {
        if (ob.date == date && ob.time == time) flg = false;
      });
      if (!flg) return;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
