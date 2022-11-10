function mneCall(date, callback) {
  const as1 = doc.gcn("cal_table")[0].gtn("a");
  const as2 = doc.gcn("cal_table")[1].gtn("a");
  const els = as1.concat(as2);
  Array.from(els).forEach((el) => {
    const str = el.attr("href");
    if (str.indexOf("GetReserveTime") == -1) return;
    let [, date, sign] = str.inparen();
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, sign] = arrDate;
  const param = {
    strReserveType: "1",
    strReserveDate: date.datify("-"),
    strDayGubun: sign,
    strNoonCode: "",
    strTDID: "",
  };
  const dictCourse = {
    11: "단일",
  };

  post("/_reserve/ReservationTimeList.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = unescape(data);
    const els = ifr.gcn("txt_btn");
    Array.from(els).forEach((el) => {
      let [date, course, time, , hole] = el.attr("href").inparen();
      date = date.rm("-");
      hole = hole + "홀";
      course = dictCourse[course];
      fee_normal = el.parentNode.parentNode.children[2].str().rm(",") * 1;
      fee_discount =
        /[0-9,]+/
          .exec(
            doc.gcn("txt_btn")[0].parentNode.parentNode.children[3].str()
          )[0]
          .rm(",") * 1;

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
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
