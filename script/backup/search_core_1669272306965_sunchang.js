function mneCall(date, callback) {
  const els = doc.body.gba("href", "yeyak_time.asp?", true);
  Array.from(els).forEach((el) => {
    const date = el.attr("href").split("&")[1].split("=")[1];
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/member/yeyak_time.asp";
  const method = "get";
  const param = {
    formname: "time",
    bjdate: date,
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "yeyak_mcheck.asp?", true);
    Array.from(els).forEach((el) => {
      let [, date, time] = ((str) => {
        const prm = str.split("?")[0];
        const ar = [];
        prm.split("&").forEach((prt) => {
          const [key, val] = prt.split("=");
          ar.push(val);
        });
        return ar;
      })(el.attr("href"));
      course = dictCourse[1];
      time = time.rm(":");
      hole = el.nm(4, 0, 0, 0, 0).str().replace(/\s/g, "").ct(1);
      const fee = 0;
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