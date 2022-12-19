function mneCall(date, callback) {
  const dt = date + "01";
  const param = {
    searchBizCd: "33",
    searchStrStartDate: date + "01",
    searchStrEndDate: date + "31",
    searchRsvnTypeCd: "IH",
  };
  get("/reservation/searchDateByStatus.json", param, {}, (data) => {
    const json = data.jp().data;
    Object.keys(json).forEach((date) => {
      let cnt = 0;
      const val = json[date];
      Object.keys(val).forEach((general) => {
        const va = val[general];
        Object.keys(va).forEach((num) => {
          const ob = va[num];
          cnt += ob.remainCnt * 1;
        });
      });
      if (cnt == 0) return;
      dates.push([date, ""]);
    });
    callback();
  });
}

/* <============line_div==========> */
function mneCallDetail(arrDate) {
  const dictCourse = {
    1: "계백장군",
    2: "의자왕",
  };
  const [date, sign] = arrDate;
  const param = {
    searchBizCd: "33",
    customerClsCd: "9020",
    searchStrDate: date,
    token: propertyStateManager.getProperty("customerClsCdToken"),
    timestamp: propertyStateManager.getProperty("customerClsCdTimestamp"),
    searchRsvnTypeCd: "IH",
    searchCourseOperTypeCd: "",
    searchJoinTypeCd: "R",
    limitCode: "",
  };

  get("/reservation/getFee", param, {}, (data) => {
    const { token, timestamp } = data.jp().data;
    const param = {
      searchBizCd: "33",
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
        searchBizCd: "33",
        searchStrDate: date,
        searchGolfFeeCd: "R165",
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
