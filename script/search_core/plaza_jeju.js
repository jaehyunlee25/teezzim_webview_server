function mneCall(date, callback) {
  const els = doc.body.gba("onclick", "javascript:checkReserveRule", true);
  Array.from(els).forEach((el) => {
    const [date] = el.attr("onclick").inparen();
    dates.push([date, ""]);
  });
  callback();
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const fCall = { post, get };
  const [date, sign, gb] = arrDate;
  const addr = "/pzc/pnr/0010/doExecute.mvc";
  const method = "post";
  const param = {
    INTF_ID: "TFO00HBSGOLREM9081",
    RECV_SVC_CD: "HBSGOLREM9081",
    DATA_NAME_I: "ds_search",
    CORP_CD: sCorpCd,
    BRCH_CD: sJejuBrchCd,
    RSRV_DATE: date,
    RNDG_DIV_CD: "%",
    INPUT_DIV_CD: "20",
    EMP_NO: "",
    HOLE_DIV_CD: "1",
    EMPLR_YN: "N",
    CONT_NO: "",
  };
  const dictCourse = {
    1: "단일",
  };

  fCall[method](addr, param, {}, (data) => {
    const json = data.jp();
    const els = json.ds.Data.ds_list;
    Array.from(els).forEach((el) => {
      let {
        RSRV_DATE: date,
        RSRV_TIME: time,
        GREN_NON_AMT: fee_normal,
        DSCNT_AMT: fee_discount,
      } = el;
      course = dictCourse[1];
      hole = 9;

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
branchBtn4.click();
setTimeout(() => {
  mneCall(thisdate, () => {
    nextMonthBtn.click();
    setTimeout(() => {
      mneCall(nextdate, procDate);
    }, 500);
  });
}, 500);
