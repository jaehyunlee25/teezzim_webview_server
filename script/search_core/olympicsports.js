function mneCall(date, callback) {
  const param = {
    str_date: date + "01",
  };
  get("/m/reserv.php", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("active");
    Array.from(els).forEach((el) => {
      const date = el.nm(0, 0).attr("href").split("=")[1];
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/m/reserv.php";
  const method = "get";
  const param = {
    str_date: date,
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:threeDayAlert", true);
    Array.from(els).forEach((el) => {
      const tr = el.nm(3);
      const time = tr.nm(0, 0).str().rm(":");
      const course = dictCourse[11];
      const hole = tr.nm(0, 1).str().trim().ct(1);
      const fee = tr.nm(0, 3).str().ct(1).rm(",") * 1;
      const fee_normal = fee;
      const fee_discount = fee;

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