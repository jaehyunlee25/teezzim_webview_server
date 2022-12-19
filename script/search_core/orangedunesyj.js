function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    year: date.gh(4),
    month: date.gt(2),
  };
  get("//api.orangedunesyj.com/v1/reservation-calender", param, {}, (data) => {
    const json = data.jp();
    const els = json.data.calenders;
    Array.from(els).forEach((el) => {
      if (el.reservationAvailableTimeCount == 0) return;
      const { bsnDate: date } = el;
      dates.push([date.rm("-"), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "//api.orangedunesyj.com/v1/reservation-calender";
  const method = "get";
  const param = {
    year: date.gh(4),
    month: date.ch(4).gh(2),
    date: date.datify(),
  };
  const dictCourse = {
    1: "East",
    2: "West",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = ((obs) => {
      let arr = [];
      obs.forEach((ob) => {
        if (ob.bsnDate != date.datify()) return;
        arr = ob.reservationTimeWithPrices;
      });
      return arr;
    })(json.data.calenders);
    Array.from(els).forEach((el) => {
      let {
        resveDate: date,
        resveTime: time,
        holeDiv: hole,
        price: fee,
        resveCourse: course,
      } = el;
      time = time.rm(":");
      date = date.rm("-");
      course = dictCourse[course];
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