javascript:(() => {
${commonScript}

/* begin blocking infinite call */
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();
log(visitNumber, visitNumber == null);
if(lsg("TZ_ADMIN_BLOCK_IC") != null) {
	log(1);
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

const splitter = location.href.indexOf("?") == -1 ? "#" : "?";
const aDDr = location.href.split(splitter)[0];
const suffix = location.href.split(splitter)[1];
const dictSplitter = {"#": "?", "?": "#"};
let addr = aDDr;
if(aDDr.indexOf(dictSplitter[splitter]) != -1) 
    addr = aDDr.split(dictSplitter[splitter])[0];

log("raw addr :: ", location.href);
log("aDDr :: ", aDDr);
log("addr :: ", addr);
    
const year = "${year}";
const month = "${month}";
const date = "${date}";
const course = "${course}";
const time = "${time}";
const dict = ${address_mapping};

const func = dict[addr];
const dictCourse = ${reserve_course_mapping};
const splitterDate = "${splitter_date}";
const fulldate = [year, month, date].join(splitterDate);

if (!func) funcOther();
else func();

function funcList() {
  log("funcList");
  return;
}
function funcMain() {
  log("funcMain");
  return;
}
function funcOut() {
  log("funcOut");
  return;
}
function funcOther() {
  log("funcOther");
  return;
}
function funcLogin() {
  log("funcLogin");
  
  const tag = localStorage.getItem("TZ_LOGIN");
  if (tag && new Date().getTime() - tag < 1000 * 5) return;
  localStorage.setItem("TZ_LOGIN", new Date().getTime());

  ${loginScript}

  return;
}
function funcReserve() {
  log("funcReserve");
  return;
}
function funcTime() {
  log("funcTime");
  return;
}
function funcExec() {
  log("funcExec");
  return;
}
function funcEnd() {
  log("funcEnd");
  return;
}
function LOGOUT() {
  log("LOGOUT");
  return;
}
})();
