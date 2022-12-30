function mneCall(date, callback) {
  const param = {
    Kind: 9,
  };
  get("/sub_03_00M.aspx", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;
    const attr = "href";
    const els = ifr.gba(attr, "sub_03_01M.aspx?", true);
    els.forEach((el) => {
      const { Kind, YMD } = el.attr(attr).gup();
      dates.push([YMD, Kind]);
    });

    param.Kind = 6;
    get("/sub_03_00M.aspx", param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;
      const attr = "href";
      const els = ifr.gba(attr, "sub_03_01M.aspx?", true);
      els.forEach((el) => {
        const { Kind, YMD } = el.attr(attr).gup();
        dates.push([YMD, Kind]);
      });
      callback();
    });
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/sub_03_01M.aspx";
  const method = "get";
  const param = {
    Kind: sign,
    YMD: date,
  };
  const dictCourse = {
    1001: "서코스",
    1002: "동코스",
  };
  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba(attr, "sub_03_02M.aspx?", true);
    els.forEach((el) => {
      let { YMD: date, T: time, C: course, F: fee } = el.attr(attr).gup();
      course = dictCourse[course];
      const hole = 18;
      fee = 130000;
      const fee_normal = fee;
      const fee_discount = fee;

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
mneCall(nextdate, procDate);