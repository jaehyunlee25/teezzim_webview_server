function mneCall(date, callback) {
  const els = doc.gcn("cal_live");
  Array.from(els).forEach((el) => {
    const [date] = el.attr("href").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "90",
    pointdate: date,
    openyn: "1",
    dategbn: "",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  const dictCourse = {
    EAST: "West",
    WEST: "East",
  };

  post("/GolfRes/onepage/real_timelist_ajax_list.asp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("cm_time_list_tbl")[0].gtn("tbody")[0].children;
    Array.from(els).forEach((el) => {
      const [, tdCourse, tdTime, tdHole, tdFeeN, tdFeeD] = Array.from(
        el.children
      );
      const course = dictCourse[tdCourse.str()];
      const time = tdTime.str().rm(":");
      const hole = tdHole.str();
      const fee_normal = tdFeeN.str().rm(",") * 1;
      const fee_discount = tdFeeD.str().rm(",") * 1;

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
