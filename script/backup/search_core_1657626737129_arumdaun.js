function mneCall(date, callback) {
  const param = {
    book_yymm: date,
  };
  get("/reserve_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const els = ifr
      .getElementsByClassName("reserve");
    Array.from(els).forEach((el) => {
      const param = el.getAttribute("onclick").inparen();
      dates.push([param[1], param]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, option] = arrDate;
  const param = {
    book_yymm: date.ct(2),
    book_date: date,
  };
  const dictCourse = {
    LAKE: "Lake",
    ROCK: "Rock",
    HILL: "Hill",
  };
  post("/reserve_02_Book.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const els = ifr
      .getElementsByClassName("boardList")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");

    Array.from(els).forEach((el, i) => {
      if (el.children.length < 6) return;
      const course = dictCourse[el.children[1].innerText.split("=>")[0]];
      const time = el.children[2].innerText;
      const fee_normal = el.children[4].innerText.split(",").join("") * 1;
      const fee_discount = el.children[4].innerText.split(",").join("") * 1;

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
mneCall(thisdate, () => {  
  mneCall(nextdate, procDate);
});