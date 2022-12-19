function mneCall(date, callback) {
  const dt = (date + "01").datify();
  const param = {
    hid_BlocNo: "01",
    month: date.gt(2),
    year: date.gh(4),
    memsel: "",
  };
  get("/mobile/reservation/m_reserve_crk.jsp", param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:goReal", true);
    Array.from(els).forEach((el) => {
      const [date] = el.attr("href").inparen();
      dates.push([date.rm('"'), ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/mobile/reservation/m_rtime.jsp?hid_BlocNo=01&memsel=700";
  const method = "post";
  const param = {
    hid_Referrer: "",
    hid_BlocNo: "01",
    hid_Li_User: "",
    hid_ClanDt: date,
    hid_DowDcd: "4",
    hid_RsrvNo: "",
    hid_RsrvDt: "",
    hid_DowDnm: "",
    hid_TiupTm: "",
    hid_TiupTmNo: "",
    hid_AddHoleFg: "",
    hid_blocNo: "01",
    hid_RsrvNo_bf: "",
    hid_RsrvDt_bf: "",
    hid_TiupTmNo_bf: "",
    rcmdDcd: "",
    rcmdManNm: "",
    rcmdManTelNo: "",
    iEnterYear: "0",
    selDate: date,
    selDay: "4",
    memberInfo: memberInfo.value,
  };
  const dictCourse = {
    1: "Pine",
    2: "Creek",
    3: "Valley",
  };

  fCall[method](addr, param, {}, (data) => {
    const ifr = doc.clm("div");
    ifr.innerHTML = data;

    const els = ifr.gba("href", "javascript:gogonext", true);
    Array.from(els).forEach((el) => {
      let [time, , fee] = el.attr("href").inparen();
      course = dictCourse[1];
      hole = 18;
      fee = fee.rm(",") * 1;
      fee_normal = fee;
      fee_discount = fee;

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
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});