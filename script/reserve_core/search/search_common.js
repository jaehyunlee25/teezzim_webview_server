${commonScript}

/* begin blocking infinite call */
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();
log(visitNumber, visitNumber == null);
if(lsg("TZ_ADMIN_BLOCK_IC") != null) {
	log(1);
	log(curTimeforVisit, lastVistTime, curTimeforVisit - lastVistTime, curTimeforVisit - lastVistTime < 1000 * 15);
	if (curTimeforVisit - lastVistTime < 1000 * 15) {
		log(2);
		if (visitNumber > 9) {
			log(3);
			if(window.AndroidController) 
				window.AndroidController.message("TZ_MSG_IC");
			TZ_BOT_SAFETY = false;
			/* 초기화 */
			visitNumber = 0;
			lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
			/* 로그아웃 */
			if (LOGOUT) LOGOUT();
		}
	} else {
		log(4);
		visitNumber = 0;
		lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
	}
} else {
	log(5);
	visitNumber = 0;
	lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
}
visitNumber++;
lss("TZ_ADMIN_BLOCK_IC", visitNumber);
log("TZ_ADMIN_BLOCK_IC", lsg("TZ_ADMIN_BLOCK_IC"), lsg("TZ_ADMIN_BLOCK_IC_TIME"));
/* end blocking infinite call */

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr);

const dict = ${address_mapping};

const func = dict[addr];
const dictCourse = ${reserve_course_mapping};

if (!func) funcOther();
else func();

function getDetail(param, fnc) {
  log("getDetail");
  post(
    OUTER_ADDR_HEADER + "/api/crawler/getScheduleDetail",
    param,
    { "Content-Type": "application/json" },
    (data) => {
      const json = JSON.parse(data);
      json.message.command = param.command;
      json.message.golf_club_id = param.golf_club_id;
		  fnc(json.message);
    }
  );
}