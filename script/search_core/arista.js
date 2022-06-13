function mneCall(date, callback) {
  const param = {
    ThisDate: date,
  };
  post("reservation_01.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;
    const tds = ifr.getElementsByClassName("book");
    Array.from(tds).forEach((td) => {
      const el = td.children[0];
      if (el.tagName != "A") return;
      const str = el.getAttribute("href");
      const vals = procHref(str);
      dates.push([vals.date, ""]);
    });
    callback();
  });
}

function mneCallDetail(arrDate) {
  const [date, course] = arrDate;
  const param = {
    book_date_bd: date,
    book_date_be: "",
    book_crs: "",
    book_crs_name: "",
    book_time: "",
  };

  post("reservation_02.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrTable = ifr.getElementsByClassName("typeB text-center mt2");
    Array.from(arrTable).forEach((table, i) => {
      const tbody = table.getElementsByTagName("tbody")[0];
      const trs = tbody.children;
      Array.from(trs).forEach((tr) => {
        const course = i === 0 ? "Lake" : "Mountain";
        const time = tr.children[0].innerText
          .replace(/\s/g, "")
          .split(":")
          .join("");
        const fee_discount =
          tr.children[1].innerText
            .replace(/\s/g, "")
            .ch(1)
            .ct(1)
            .split(",")
            .join("") * 1;
        const fee_normal =
          tr.children[1].innerText
            .replace(/\s/g, "")
            .ch(1)
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

function procHref(str) {
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, "").split(",");
  return { date: values.join(""), type: "" };
}

mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
