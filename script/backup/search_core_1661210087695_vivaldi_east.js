function mneCall(date, callback) {
  Array.from(mabari.children).forEach((el) => {
    const date = el.children[0].getAttribute("data-date");
    const sign = el.children[1].innerText;
    if (sign != "예약") return;
    dates.push([date, ""]);
  });

  callback();
}

/* <============line_div==========> */

function mneCallDetail(arrDate) {
  const [date] = arrDate;
  const param = {
    fRsvD: date,
    fJiyukCd: "60",
    fStoreCd: 2180,
  };

  post("/m.rsv.selectMobileRsvStepOne.dp/dmparse.dm", param, {}, (data) => {
    const ifr = document.createElement("div");
    ifr.innerHTML = data;

    const arrDiv = ifr.getElementsByClassName("grid-content-container");
    Array.from(arrDiv).forEach((el) => {
      const course = el.children[1].innerText.replace(/\s/g, "");
      const time = el.children[0].innerText
        .replace(/\s/g, "")
        .ct(1)
        .split("시")
        .join("");
      const fee_discount =
        el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;
      const fee_normal =
        el.children[2].innerText.replace(/\s/g, "").split(",").join("") * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: "",
        persons: "",
        fee_normal,
        fee_discount,
        others: course,
      });
    });
    procDate();
  });
}

/* <============line_div==========> */

/* <============line_div==========> */

mneCall(thisdate, procDate);
