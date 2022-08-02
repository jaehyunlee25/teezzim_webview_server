/* begin blocking infinite call */
const TZ_BOT_SAFETY = true;
if(lsg("TZ_ADMIN_BLOCK_IC")) {
	const visitNumber = lsg("TZ_ADMIN_BLOCK_IC") * 1;
	const lastVistTime = lsg("TZ_ADMIN_BLOCK_IC_TIME") * 1;
	if (lastVistTime < 1000 * 15) {
		if (visitNumber > 9) {
			window.AndroidController.message("TZ_MSG_IC");
			TZ_BOT_SAFETY = false;
			/* 초기화 */
			lss("TZ_ADMIN_BLOCK_IC", 0);
			lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
			/* 로그아웃 */
			if (LOGOUT) LOGOUT();
		}
	} else {
		lss("TZ_ADMIN_BLOCK_IC", 0);
		lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
	}
} else {
	lss("TZ_ADMIN_BLOCK_IC", 0);
	lss("TZ_ADMIN_BLOCK_IC_TIME", new Date().getTime());
}
log("TZ_ADMIN_BLOCK_IC", lsg("TZ_ADMIN_BLOCK_IC"), lsg("TZ_ADMIN_BLOCK_IC_TIME"));
/* end blocking infinite call */

const clubId = '${golf_club_id}';
const courses = { 
	${golf_course}
};