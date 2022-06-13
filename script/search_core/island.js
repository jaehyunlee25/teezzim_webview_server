function mneCall(date, callback) {
  const param = {};
  post("reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const str = a.getAttribute("href");
      if (!str || str.indexOf("JavaScript:Date_Click") === -1) return;
      const ob = procStr(str);
      dates.push([ob.date, 0]);
    });

    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = { book_date: date };
  post("reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName("a");
    Array.from(as).forEach((a) => {
      const str = a.getAttribute("href");
      if (!str || str.indexOf("JavaScript:Book_") === -1) return;

      const ob = procStrDetail(str);
      const { course, time, fee_normal, fee_discount } = ob;
      const slot = time.gh(2);

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: "",
      });
    });
    procDate();
  });
}

mneCall("", procDate);
