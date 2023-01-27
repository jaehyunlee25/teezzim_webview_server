function mneCall(date, callback) {
EXTZLOG("search", "mneCall");
  const els = doc.gba("href", "javascript:Update('LIST", true);
  Array.from(els).forEach((el) => {
    if (el.nm(1).className.indexOf("possible") == -1) return;
    const [str] = el.attr("href").inparen();
    const [, , date, sign] = str.split("|");
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["SelectedDate"] = date.datify();
  param["Day_Gubun"] = num;
  param["ctl00$ContentPlaceHolder1$htbArgs"] =
    "PREV|" + date.datify() + "|" + date.datify() + "|date";

  const dictCourse = {
    11: "전주",
    22: "익산",
    33: "김제",
    44: "정읍",
    55: "부안",
    66: "남원",
    77: "순창",
    88: "LAKE",
    99: "REED",
  };

  post(
    "/Mobile/Reservation/ReservationTimeList.aspx?typecode=date",
    param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gcn("reserv_btn");
      Array.from(els).forEach((el) => {
        let [date, course, , time, , , hole] = el.attr("href").inparen();
        course = dictCourse[course];
        const fee_discount = 140000;
        const fee_normal = 140000;
        hole = hole + "홀";

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
  doc.gcn("arw-next")[0].click();
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 500);  
});
