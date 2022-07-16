function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  get("/mobile/reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr.getElementsByClassName("book");
    Array.from(els).forEach((el) => {
      const param = el
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .inparen();
      dates.push([param[1], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const dictCourse = {
    0: "파인힐",
    1: "오크힐",
    2: "로키힐",
  };
  const param = {
    proc_div: option[0],
    book_yymm: date.ch(2),
    book_date: date,
  };
  get("/mobile/reservation_02.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const tbls = ifr.getElementsByClassName("typeB text-center mt2");
    Array.from(tbls).forEach((tbl, i) => {
      const els = tbl
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr");
      Array.from(els).forEach((el) => {
        const course = dictCourse[i];
        const time = el.children[0].innerText;
        let fee_normal = el.children[1].innerText.ct(1).split(",").join("") * 1;
        let fee_discount =
          el.children[1].innerText.ct(1).split(",").join("") * 1;

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
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
