function mneCall(date, callback) {
  const obj = {};
  location.href
    .split("?")[1]
    .split("&")
    .forEach((el) => {
      const [key, val] = el.split("=");
      obj[key] = val;
    });
  const ClubNumber = obj.gc_no;
  const param = {
    gc_no: ClubNumber ,
    search_type: "simple",
    rand: "",
  };
  post("/reserve/ajax/commonTeeList", param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.reservePossibleDateMap;
    Object.keys(els).forEach((date) => {
      const obj = els[date];
      if (obj.reserve_possible_cnt == 0) return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date, num] = arrDate;
  const param = {
    select_date: date,
    rand: "",
  };
  const dictCourse = {
    HILL: "Hill",
    LAKE: "Lake",
  };

  const obj = {};
  location.href
    .split("?")[1]
    .split("&")
    .forEach((el) => {
      const [key, val] = el.split("=");
      obj[key] = val;
    });
  const ClubNumber = obj.gc_no;

  post("/reserve/ajax/teeList/" + ClubNumber, param, {}, (data) => {
    const json = JSON.parse(data);
    const els = json.teeList;
    Array.from(els).forEach((el) => {
      let {
        teeup_time: time,
        price,
        dc_price,
        course_nm: course,
        time_date: date,
        bk_round: hole,
      } = el;
      course = dictCourse[course];
      const fee_discount = price - dc_price;
      const fee_normal = price;
      hole = hole + "홀";

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: hole,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, procDate);