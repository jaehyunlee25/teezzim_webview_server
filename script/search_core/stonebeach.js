function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    today_date: dt,
    calendar_size: "small",
  };
  post("/reservation/get_calendar", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gcn("reserve");
    Array.from(els).forEach((el) => {
      const date = el.attr("id").rm("-");
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/reservation/get_teetime_data_price2";
  const method = "post";
  const param = {
    this_day: date.datify(),
    course: "all",
  };
  const dictCourse = {
    1: "스톤",
    2: "비치",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.list;
    Array.from(els).forEach((el) => {
      let {
        CH_DATE: date,
        CH_TIME: time,
        CH_COURSE: course,
        RP_PRICE: fee,
      } = el;
      date = date.rm("-");
      course = dictCourse[course];
      hole = 18;
      fee_normal = fee * 1;
      fee_discount = fee * 1;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
