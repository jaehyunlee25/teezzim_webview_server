function mneCall(date, callback) {
  const dt = [date.gh(4), date.gt(2), "01"].join("-");
  const param = {};
  Array.from(aspnetForm.elements).forEach((el) => (param[el.name] = el.value));
  param["htbArgs"] = "PREV|" + dt + "|" + dt + "";
  param["ScptManager"] = "ScptManager|btnUpd";
  param["__EVENTTARGET"] = "btnUpd";
  post("/Mobile/", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const els = ifr.gcn("open");

    const ipts = ifr.getElementsByTagName("input");
    Array.from(ipts).forEach((ipt) => {
      if (!ipt.id) return;
      global_param[ipt.name] = ipt.value;
    });

    Array.from(els).forEach((el) => {
      let [, date] = el.children[0].attr("href").inparen();
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
  global_param["Choice_Date"] = date.datify();
  global_param["Choice_Time"] = "";
  global_param["Choice_Course"] = "";
  global_param["Day_Gubun"] = 1;
  global_param["hdnSeq"] = "";
  global_param["choice_hole"] = "";
  global_param["DaegiYN1"] = "";
  global_param["htbArgs"] = "";
  const dictCourse = {
    11: "Hidden",
    22: "Sky",
    33: "Valley",
  };

  post(
    "/Mobile/Reservation/ReservationTimeList.aspx",
    global_param,
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const els = ifr.gcn("bt_reserved");
      Array.from(els).forEach((el) => {
        let [date, course, time, , , hole, , fee_discount, fee_normal] =
          el.children[0].attr("href").inparen();
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
