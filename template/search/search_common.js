/* begin blocking infinite call */
let TZ_BOT_SAFETY = true;
let visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
let lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
let curTimeforVisit = new Date().getTime();

EXTZLOG("search", [visitNumber, visitNumber == null].join(", "), {
  LOGID,
  step: "IC_CHK",
});
if (lsg("TZ_ADMIN_BLOCK_IC") != null) {
  if (curTimeforVisit - lastVistTime < 1000 * 15) {
    if (visitNumber > 9) {
      if (ac) ac.message(JSON.stringify({ command: "TZ_MSG_IC" }));
      TZ_BOT_SAFETY = false;
      /* 초기화 */
      visitNumber = 0;
      lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
      /* 로그아웃 */
      if (LOGOUT) LOGOUT();
    }
  } else {
    visitNumber = 0;
    lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
  }
} else {
  visitNumber = 0;
  lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
}
visitNumber++;
lss("TZ_ADMIN_BLOCK_IC", visitNumber);
EXTZLOG(
  "search",
  [
    "TZ_ADMIN_BLOCK_IC",
    lsg("TZ_ADMIN_BLOCK_IC"),
    lsg("TZ_ADMIN_BLOCK_IC_TIME"),
  ].join(", "),
  { LOGID, step: "IC_CHK" }
);
/* end blocking infinite call */

let global_param = {};
const COMMAND = "${command}";
const clubId = "${golf_club_id}";
const courses = {
  ${golf_course}
};
EXTZLOG("search", ["start search", COMMAND], { LOGID, step: "IC_CHK" });
EXTZLOG("search", ["step::", 1].join(", "), { LOGID, step: "IC_CHK" });
