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
  };

  post("reservation_02.asp", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrTable = ifr.getElementsByClassName("typeB text-center mt2");
    Array.from(arrTable).forEach((table, i) => {
      if (i !== 0) return;
      const tbody = table.getElementsByTagName("tbody")[0];
      const trs = tbody.children;
      Array.from(trs).forEach((tr) => {
        const course = tr.children[0].innerText;
        const time = tr.children[1].innerText
          .replace(/\s/g, "")
          .split(":")
          .join("");
        let fee_discount =
          tr.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;
        let fee_normal =
          tr.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;

        if (!fee_discount) fee_discount = -1;
        if (!fee_normal) fee_normal = -1;

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
