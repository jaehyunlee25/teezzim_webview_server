function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("/Miryang_nobel/mobile/reserve.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "JavaScript:Date_Click", true);
    Array.from(els).forEach((el) => {
      const [year, month, date] = el.attr("href").inparen();
      const dt = [year, month, date].join("");
      dates.push([dt, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/Miryang_nobel/mobile/reserve_step1.asp";
  const method = "post";
  const param = {
    book_date_bd: date,
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };
  const dictCourse = {
    11: "Lake",
    22: "Hill",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onClick", "bookconfirm", true);
    Array.from(els).forEach((el) => {
      let [date, , course, , time] = el.attr("onClick").inparen();
      course = dictCourse[course];
      const fee_normal = 130000;
      const fee_discount = 130000;

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