function mneCall(date, callback) {
  const els = doc.gcn("onclick");
  Array.from(els).forEach((el) => {
    const date = el.attr("data-dt");
    dates.push([date.rm("-"), ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    p_calgbn: "A",
    p_cos: "",
    p_date: date,
    p_golfgbn: "160",
    p_rtype: "1",
  };
  const dictCourse = {
    거북: "거북",
    백호: "백호",
    청룡: "청룡",
  };

  post(
    "/_AJAX/reservation/services.asmx/GetGolfTimeList",
    param,
    { "Content-Type": "application/json" },
    (data) => {
      const str = JSON.parse(data).d;
      const json = JSON.parse(str);
      const html = json.html;
      const ifr = doc.clm("table");
      ifr.innerHTML = html;

      const els = ifr.children[0].children;
      Array.from(els).forEach((el) => {
        const [tdCourse, tdTime, tdFee] = Array.from(el.children);
        const time = tdTime.str().rm(":");
        const course = dictCourse[tdCourse.str()];
        const fee = tdFee.str().ct(1).rm(",") * 1;
        const fee_discount = fee;
        const fee_normal = fee;
        const hole = "9홀";

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
mneCall(thisdate, procDate);
