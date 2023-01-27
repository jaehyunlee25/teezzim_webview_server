function mneCall(date, callback) {
  const els = doc.gba("class", "calendar__day");
  Array.from(els).forEach((el) => {
    const fulldate = el.attr("id");
    dates.push([fulldate, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/m/getTeeOffTime.asp";
  const method = "post";
  const param = {
    rProductSelectedType: "GO",
    rRoundDate: date,
  };
  const dictCourse = {
    1: "선셋",
    2: "선라이즈",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const attr = "href";
    const els = ifr.gba("name", "TeeOffTime");
    Array.from(els).forEach((el) => {
      const value = el.attr("value");
      const date = value.gh(8);
      const course = dictCourse[value.ch(8).gh(1)];
      const time = value.gt(4);
      const hole = 18;
      const fee_normal = 400000;
      const fee_discount = 400000;

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
function funcMove() {
  doc.gba("value", "GO")[0].click();
  doc.gba("class", "pubNextBtn")[0].click();
}

/* <============line_div==========> */
mneCall(thisdate, procDate);