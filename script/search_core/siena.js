function mneCall(date, callback) {
  const tds = document.getElementsByClassName("book");
  Array.from(tds).forEach((td) => {
    const el = td.children[0];
    if (el.tagName != "A") return;
    const str = el.getAttribute("href");
    const vals = procHref(str);
    dates.push([vals.date, ""]);
  });
  callback();
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    book_date_bd: date,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };

  post("reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrDiv = ifr.getElementsByClassName("select_time");
    Array.from(arrDiv).forEach((div, i) => {
      const table = div.children[1].children[0];
      const tbody = table.getElementsByTagName("tbody")[0];
      const trs = tbody.children;
      Array.from(trs).forEach((tr) => {
        const course = i === 0 ? "서코스" : "동코스";
        const time = tr.children[0].innerText
          .replace(/\s/g, "")
          .split(":")
          .join("");
        const fee_discount =
          tr.children[1].innerText
            .replace(/\s/g, "")
            .ct(1)
            .split(",")
            .join("") * 1;
        const fee_normal =
          tr.children[1].innerText
            .replace(/\s/g, "")
            .ct(1)
            .split(",")
            .join("") * 1;

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

/* <============line_div==========> */

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join(""), type: "" };
}

/* <============line_div==========> */

mneCall(thisdate, procDate);
