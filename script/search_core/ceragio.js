function mneCall(date, callback) {
  const els = doc.gcn("calendar-t-time");
  let month = date.gt(2);
  Array.from(els).forEach((el) => {
    const str = el.str();
    if (str.gh(1) != "T") return;
    let dt = el.nm(1, 0).str();
    if (dt.indexOf("/") != -1) {
      month = dt.split("/")[0];
      dt = dt.split("/")[1];
    }
    const fulldate = [date.gh(4), month, dt].join("");
    dates.push([fulldate, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/reservation/getbooktimelist";
  const method = "get";
  const param = {
    golfInfoSeq: "131",
    bookDate: date,
  };
  const dictCourse = {
    819: "In(지오)",
    818: "Out(세라)",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = ((obj) => {
      const res = [];
      Object.keys(obj).forEach((key) => {
        const ar = obj[key];
        ar.forEach((ob) => {
          res.push(ob);
        });
      });
      return res;
    })(json);
    Array.from(els).forEach((el) => {
      let {
        bookDate: date,
        bookTime: time,
        greenFeeNO: fee_normal,
        greenFeeDC: fee_discount,
        holeCnt: hole,
        CourseSeq: course,
      } = el;
      course = dictCourse[course];

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
