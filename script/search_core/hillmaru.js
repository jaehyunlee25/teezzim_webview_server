function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["ctl00$ContentPlaceHolder1$sManager"] =
    "ctl00$ContentPlaceHolder1$sManager|ctl00$ContentPlaceHolder1$btUp";
  param["ctl00$ContentPlaceHolder1$hdfParam"] = "CALENDAR|" + dt + "|";
  param["__EVENTTARGET"] = "ctl00$ContentPlaceHolder1$btUp";
  param["__ASYNCPOST"] = "true";
  post("/Mobile/Reservation/Reservation.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("reserve");

    const ipts = ifr.gtn("input");
    Array.from(ipts).forEach((ipt) => {
      if (!ipt.id) return;
      global_param[ipt.name] = ipt.value;
    });

    Array.from(els).forEach((el) => {
      let [date] = el.attr("href").inparen();
      date = date.rm("-");
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const dt = [date.gh(4), date.ct(2).gt(2), "01"].join("-");
  global_param["strReserveDate"] = date.datify();
  const dictCourse = {
    11: "힐(동)",
    22: "힐(서)",
    33: "마루(남)",
    44: "마루(북)",
  };

  post(
    "/Mobile/Reservation/ReservationTimeList.aspx",
    global_param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gcn("timeTbl")[0].gtn("a");
      Array.from(els).forEach((el) => {
        const [prm] = el.attr("href").inparen();
        let [, date, time, course, , , hole, , , fee_discount, fee_normal] =
          prm.split("|");
        date = date.rm("-");
        course = dictCourse[course];
        hole = hole + "홀";
        fee_normal = fee_normal * 1;
        fee_discount = fee_discount * 1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: course,
          date,
          time,
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: hole,
        });
      });
      procDate();
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});