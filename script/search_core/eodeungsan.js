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
    book_date: date,
    book_time: "",
    book_crs: "",
    sale_div: "",
    book_crs_name: "",
  };

  post("reservation_02.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrTable = ifr.getElementsByClassName("typeB text-center mt2");
    Array.from(arrTable).forEach((table, i) => {
      const tbody = table.getElementsByTagName("tbody")[0];
      const trs = tbody.children;
      Array.from(trs).forEach((tr) => {
        if (tr.children.length < 2) return;
        const course = i === 0 ? "어등" : i === 1 ? "송정" : "하남";
        const time = tr.children[0].innerText
          .replace(/\s/g, "")
          .gh(5)
          .split(":")
          .join("");
        const fee_discount = 140000;
        const fee_normal = 140000;

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
