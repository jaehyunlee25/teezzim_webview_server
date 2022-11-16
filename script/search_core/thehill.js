function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "date_check", true);
  Array.from(els).forEach((el) => {
    const [date, sign] = el.attr("onclick").inparen();
    dates.push([date.rm("-"), sign]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/res/reserv_list.asp";
  const method = "post";
  const param = {
    Choice_Date: date.datify(),
    Day_Gubun: "",
    Day_Course: "",
    nwGroup: "160",
    Reserve_Change: "",
    Reserve_Change_Time: "",
    Reserve_Change_Course: "",
    Choice_Code: "2675723",
  };
  const dictCourse = {
    11: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:incode", true);
    Array.from(els).forEach((el) => {
      let [date, time, course, sign] = el.attr("href").inparen();
      date = date.rm("-");
      course = dictCourse[course];
      hole = el
        .nm(2, 0)
        .str()
        .regex(/[0-9]+?H/)[0]
        .ct(1);
      const fee =
        el
          .nm(2, 0, 2)
          .str()
          .regex(/[0-9,]+/)[0]
          .rm(",") * 1;
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
