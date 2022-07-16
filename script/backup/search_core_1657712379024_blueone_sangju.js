function mneCall(date, callback) {
  const els = document.getElementsByClassName("state01");
  Array.from(els).forEach((el) => {
    const fulldate = el.children[0].getAttribute("data-date");
    dates.push([fulldate, param]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    bookDate: date,
    cCorpCode: "03",
    reservType: "1",
    reserveAmPm: "not",
    yinCoseType: "",
    tempMemberState: "003",
    taOpen: "001",
    dayCode: "001",
    mode: "new",
    rev_coseCd: "",
    rev_time: "",
    rev_teamMemCnt: "",
    rev_rndCode: "",
    rev_vTime: "",
    rev_cose: "",
    rev_nocaddyYn: "",
    rev_rndCd: "",
    rev_bookStts: "",
  };
  const dictCourse = {
    서: "West",
    동: "East",
  };
  post("/shop/golf/get_time.jsp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("golf_time")[0]
      .getElementsByTagName("a");

    Array.from(els).forEach((el, i) => {
      const course = dictCourse[el.getAttribute("data-cose").gh(1)];
      const time = el.getAttribute("data-time");
      let fee_normal = el.getAttribute("data-totalamt").split(",").join("") * 1;
      let fee_discount =
        el.getAttribute("data-saleamt").split(",").join("") * 1;

      if (isNaN(fee_normal)) fee_normal = -1;
      if (isNaN(fee_discount)) fee_discount = -1;

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

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);