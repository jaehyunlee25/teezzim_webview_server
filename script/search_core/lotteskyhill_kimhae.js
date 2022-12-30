function mneCall(date, callback) {
  const param = {
    searchBizCd: "30",
    searchStrStartDate: date + "01",
    searchStrEndDate: date + "31",
    searchCustomerClsCd: "9020",
    searchRsvnTypeCd: "IH",
    searchJoinTypeCd: "R",
    searchPkgFeeCd: "",
    searchPkgId: "",
  };
  get("/reservation/searchDate.json", param, {}, (data) => {
    const json = data.jp();
    const els = json.list;
    Array.from(els).forEach((el) => {
      if (el.inetRsvnYn != "Y") return;
      if (el.remainCnt == "0") return;
      dates.push([el.playDate, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const dictCourse = {
    1: "Sky",
    2: "Hill",
  };
  const [date, course] = arrDate;
  const param = {
    searchBizCd: "30",
    customerClsCd: "9020",
    searchStrDate: date,
    token: propertyStateManager.getProperty("customerClsCdToken"),
    timestamp: propertyStateManager.getProperty("customerClsCdTimestamp"),
    agentCd: "",
    reservationNo: "",
    searchJoinTypeCd: "R",
  };

  get("/reservation/getFee", param, {}, (data) => {
    const { token, timestamp } = data.jp().data;
    const param = {
      searchBizCd: "30",
      searchStrStartDate: date.gh(6) + "01",
      searchStrEndDate: date.gh(4) * 1 + 1 + date.gt(4),
      searchCustomerClsCd: "9020",
      searchRsvnTypeCd: "IH",
      searchJoinTypeCd: "R",
      searchPkgFeeCd: "",
      searchPkgId: "",
    };
    get("/reservation/searchDate.json", param, {}, (data) => {
      const param = {
        searchBizCd: "30",
        searchStrDate: date,
        searchGolfFeeCd: "HD10",
        searchCustomerClsCd: "9020",
        searchRsvnTypeCd: "IH",
        searchCourseOperTypeCd: "",
        token,
        timestamp,
        searchJoinTypeCd: "R",
      };
      setTimeout(() => {
        get("/reservation/searchTeeOff.json", param, {}, (data) => {
          const json = data.jp().groupingMap;
          Object.keys(json).forEach((hour) => {
            const val = json[hour];
            Object.keys(val).forEach((course) => {
              const tVal = val[course];
              Object.keys(tVal).forEach((time) => {
                const arr = tVal[time];
                arr.forEach((obj) => {
                  let {
                    playDate: date,
                    playTime: time,
                    coseTypeCode: course,
                    defaultPrice: fee_normal,
                    splyPrice: fee_discount,
                    holeTypeName: hole,
                  } = obj;
                  fee_normal *= 1;
                  fee_discount *= 1;
                  course = dictCourse[course];

                  golf_schedule.push({
                    golf_club_id: clubId,
                    golf_course_id: course,
                    date,
                    time,
                    in_out: "",
                    persons: "",
                    fee_normal,
                    fee_discount,
                    others: "18홀",
                  });
                });
              });
            });
          });
          procDate();
        });
      }, 1000);
    });
  });
}

/* <============line_div==========> */

/* <============line_div==========> */
mneCall(thisdate, () => {
  mneCall(nextdate, procDate);
});
