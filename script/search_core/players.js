function mneCall(date, callback) {
  const param = {
    layout: 3,
    membership: "",
    year: date.gh(4),
    month: date.gt(2) * 1,
    timezone: "",
    course: "",
    date: "",
  };
  post("/_cm_core/reservation/ajax/calendar.asp", param, {}, (data) => {
    const json = JSON.parse(data);
    const result = {};
    Object.keys(json.time_count).forEach((key) => {
      if (key === "_") return;
      const [strDate, div, number] = key.split("_");
      if (number != "0") result[strDate] = true;
    });
    Object.keys(result).forEach((strDate) => {
      dates.push([strDate, 0]);
    });
    callback();
  });
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    type: "Real",
    membership: "",
    timezone: "",
    course: "",
    date: date,
  };
  post("/_cm_core/reservation/ajax/timelist.asp", param, {}, (data) => {
    const objResp = JSON.parse(data).timelist;
    const dict = { 1: "VALLEY", 2: "LAKE", 3: "MOUNTAIN" };
    objResp.forEach((obj) => {
      const course = dict[obj.course];
      const time = obj.time.gh(2) + ":" + obj.time.gt(2);
      const fee_normal = obj.gf_ori * 1;
      const fee_discount = obj.gf_dis * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "9홀",
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
