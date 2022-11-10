function mneCall(date, callback) {
  const els = doc.gcn("rev");
  els.forEach((el, i) => {
    const date = el.attr("data-dt").rm("-");
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign] = arrDate;
  const addr = "/_AJAX/reservation/services.asmx/GetGolfTimeList";
  const method = "post";
  const param = {
    p_cos: "",
    p_date: date.datify(),
    p_golfgbn: "160",
    p_rmode: "m",
    p_rtype: "",
  };
  const dictCourse = {
    11: "마운틴",
    22: "밸리",
    33: "레이크",
  };
  const signCourses = ["11", "22", "33"];
  exec();
  function exec() {
    const signCourse = signCourses.shift();
    if (!signCourse) {
      procDate();
      return;
    }
    param["p_cos"] = signCourse;
    fCall[method](
      addr,
      param,
      { "Content-Type": "application/json" },
      (data) => {
        const str = data.jp().d;
        const json = str.jp();
        const html = json.html;
        const ifr = doc.clm("table");
        ifr.innerHTML = html;

        const els = ifr.gtn("tr");
        Array.from(els).forEach((el) => {
          const [tdTime, , tdFee] = Array.from(el.children);
          const time = tdTime.str().trim().rm(":");
          course = dictCourse[signCourse];
          const hole = 18;
          fee_normal = tdFee.str().ct(1).rm(",") * 1;
          fee_discount = tdFee.str().ct(1).rm(",") * 1;

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
        exec();
      }
    );
  }
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);
