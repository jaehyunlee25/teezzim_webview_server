function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("reserve01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const btns = ifr.getElementsByClassName("book");
    Array.from(btns).forEach((btn) => {
      const str = btn.getAttribute("onclick");
      const vals = procHref(str);
      dates.push([vals.date, ""]);
    });
    console.log(dates);
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    book_date: date,
    ThisDate: date,
  };

  post("reserve01_step1.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const tbody = ifr.getElementsByTagName("tbody")[0];
    const Sea = tbody.children[0].children[0];
    const Blue = tbody.children[0].children[1];
    const tds = [Sea, Blue];
    tds.forEach((td, i) => {
      const btns = td.getElementsByTagName("button");
      Array.from(btns).forEach((btn) => {
        const strOnclick = btn.getAttribute("onclick");
        const regex = /\((.+)\)/;
        const values = regex.exec(strOnclick)[1].replace(/'/g, "").split(",");
        const course = values[3];
        const time = values[4];
        const fee_discount = 125000;
        const fee_normal = 125000;

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
    });
    procDate();
  });
}

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join(""), type: "" };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
