function mneCall(date, callback) {
  const els = doc.body.gba("href", "javascript:Reserve", true);
  Array.from(els).forEach((el) => {
    const [, date, sign] = el.attr("href").inparen();
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/_YeongCheon/Mobile/Reservation/ReservationTimeList.aspx";
  const method = "post";
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["strLGubun"] = "160";
  param["strReserveDate"] = date.datify();
  param["strDayType"] = sign;
  const dictCourse = {
    11: "가람",
    22: "누리",
    33: "마루",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:ReserveCheck", true);
    Array.from(els).forEach((el) => {
      const [str] = el.attr("href").inparen();
      let [, , date, time, course, sign, , hole, , , , , fee] = str.split("|");
      date = date.rm("-");
      course = dictCourse[course];
      fee = fee.rm(",") * 1000;
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
mneCall(thisdate, procDate);