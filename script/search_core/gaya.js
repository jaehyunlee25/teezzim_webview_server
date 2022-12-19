function mneCall(date, callback) {
  const els = doc.body.gba("href", "./01_reservation.php", true);
  Array.from(els).forEach((el) => {
    const prm = ((str) => {
      const res = {};
      const prm = str.split("?&")[1];
      prm.split("&").forEach((prt) => {
        const [key, val] = prt.split("=");
        res[key] = val;
      });
      return res;
    })(el.attr("href"));
    dates.push([prm.daychoice, prm]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/01/01_reservation.php";
  const method = "get";
  const param = sign;
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:incode", true);
    Array.from(els).forEach((el) => {
      let [, time, hole] = el.attr("href").inparen();
      hole = hole.ct(1);
      course = dictCourse[1];
      const fee = 75000;
      fee_normal = fee;
      fee_discount = fee;

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
