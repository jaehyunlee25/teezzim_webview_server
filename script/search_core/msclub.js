function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "location.href=", true);
  Array.from(els).forEach((el) => {
    const date = el.attr("onclick").split("?")[1].split("&")[0].split("=")[1];
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/Reservation/time.asp";
  const method = "get";
  const param = {
    time_date: date,
    seasoncd: "1",
  };
  const dictCourse = {
    1: "Champion",
    2: "Master",
    3: "Challenge",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("onclick", "location.href=", true);
    Array.from(els).forEach((el) => {
      let {
        reser_date: date,
        reser_time: time,
        reser_price: fee,
        course,
        type_desc: hole,
      } = ((str) => {
        const obj = {};
        str
          .split("?")[1]
          .split("&")
          .forEach((par) => {
            const [key, val] = par.split("=");
            obj[key] = val;
          });
        return obj;
      })(el.attr("onclick"));
      course = dictCourse[course];
      time = time.rm(":");
      fee = fee.regex(/[0-9]+/)[0] * 10000;
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