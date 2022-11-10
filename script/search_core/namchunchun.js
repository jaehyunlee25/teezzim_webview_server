function mneCall(date, callback) {
  post(
    "/html/reservation/reservation_01_01.asp",
    { book_date_bd: date },
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const date = ifr.gcn("plan-month2")[0].gtn("span")[0];
      const year = date.children[0].str();
      const month = date.children[1].str();

      const tables = ifr.gtn("table");
      const tblOverView = tables[0];
      const tblDetail = tables[2];

      const tdDays = tblOverView.gcn("gray");
      Array.from(tdDays).forEach((td) => {
        const text = td.str().trim().gh(2);
        const team = td.str().trim().ch(2).ct(1);
        dates.push([year + month + text, team]);
      });
      callback();
    }
  );
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const [date] = arrDate;
  post(
    "/html/reservation/reservation_01_01.asp",
    { book_date_bd: date },
    {},
    (data) => {
      const ifr = doc.clm("div");
      ifr.innerHTML = data;

      const tds = ifr.gcn("course_list_table")[1].gtn("tbody")[0]
        .children[0].children;
      const [victory, challenge] = tds;
      const obTeams = { victory: {}, challenge: {} };

      Array.from(victory.children).forEach((div) => {
        const str = div.innerText;
        const time = str.gh(2);
        const fee_discount = div.children[1].str().ch(1).replace(/,/g, "") * 1;
        const fee_normal = div.children[0].str().ch(1).replace(/,/g, "") * 1;

        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: "Victory",
          date,
          time: str.gh(5),
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "",
        });
      });
      Array.from(challenge.children).forEach((div) => {
        const str = div.innerText;
        const time = str.gh(2);
        const fee_discount = div.children[1].str().ch(1).replace(/,/g, "") * 1;
        const fee_normal = div.children[0].str().ch(1).replace(/,/g, "") * 1;
        golf_schedule.push({
          golf_club_id: clubId,
          golf_course_id: "Challenge",
          date,
          time: str.gh(5),
          in_out: "",
          persons: "",
          fee_normal,
          fee_discount,
          others: "",
        });
      });
      procDate();
    }
  );
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  setTimeout(() => {
    mneCall(nextdate, procDate);
  }, 1000);
});
