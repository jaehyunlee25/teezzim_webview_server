function mneCall(date, callback) {
  const els = doc.gcn("bookyesbgcolor");
  Array.from(els).forEach((el) => {
    const param = el.attr("onclick").inparen();
    const [fulldate] = param;
    dates.push([fulldate, 0]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const dictCourse = {
    1: "Valley",
    2: "Hill",
    3: "Lake",
    4: "Gold",
  };
  const arr = [1, 2, 3, 4];

  exec();

  function exec() {
    const courseCode = arr.shift();
    if (!courseCode) {
      procDate();
      return;
    }

    const param = {
      gm_ymd: date,
      gm_crs_id: courseCode,
      book_start_ymd: "",
      book_end_ymd: "",
    };
    post("/booking/booking01_01.asp", param, {}, (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;
  
      const els = ifr.gcn("md-trigger");
      Array.from(els).forEach((el) => {
        const time = el.attr("data-time");
        const course = dictCourse[courseCode];
        fee_discount = 160000;
        fee_normal = 160000;
  
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
      exec();
    });
  }  
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);