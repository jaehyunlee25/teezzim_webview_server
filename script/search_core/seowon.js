function mneCall(date, callback) {
  const param = {
    selYM: date,
    _: new Date().getTime(),
  };
  get("/hills/reservation/getCalendar.do", param, {}, (data) => {
    const json = JSON.parse(data);
    json.rows.forEach((ob) => {
      if (ob.BK_TEAM * 1 === 0) return;
      dates.push([ob.CL_SOLAR, ""]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    date: date,
    roundf: "1",
    _: "",
  };
  get("/hills/reservation/getTeeList.do", param, {}, (data) => {
    const objResp = JSON.parse(data).rows;
    const dict = { A: "EAST", B: "WEST", C: "SOUTH" };
    objResp.forEach((obj) => {
      const course = dict[obj.BK_COS];
      const time = obj.BK_TIME.gh(2) + ":" + obj.BK_TIME.gt(2);
      const fee_normal = obj.BK_BASIC_CHARGE.replace(/\,/g, "") * 1;
      const fee_discount = obj.BK_BASIC_CHARGE.replace(/\,/g, "") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "18홀",
      });
    });
    procDate();
  });
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
