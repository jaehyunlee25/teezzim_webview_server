const clubId = '426bb817-cdb1-11ec-a93e-0242ac11000a';
const courses = { 
	오똔: 'b239a922-cdb1-11ec-a93e-0242ac11000a',
	이베르: 'b239ab02-cdb1-11ec-a93e-0242ac11000a',
	브렝땅: 'b239ab3d-cdb1-11ec-a93e-0242ac11000a',
	에떼: 'b239aba3-cdb1-11ec-a93e-0242ac11000a',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { 'Content-Type': 'application/json' };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
    workMonthNext();
    setTimeout(() => {
      mneCall(nextdate, procDate);
    }, 3000);
  });

function procDate() {
  const lmt = dates.length - 1;
  let cnt = 0;
  const timer = setInterval(() => {
    if(cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    const [date] = dates[cnt];
    console.log('수집하기', cnt + '/' + lmt, date);
    mneCallDetail(date);
    cnt++;
  }, 300);
}
function procGolfSchedule() {
	golf_schedule.forEach((obj) => {
		obj.golf_course_id = courses[obj.golf_course_id];
		obj.date = obj.date.gh(4) + '-' + obj.date.ch(4).gh(2) + '-' + obj.date.gt(2);
	});
	console.log(golf_schedule);
	const param = { golf_schedule, golf_club_id: clubId };
	post(addrOuter, param, header, () => {
		const ac = window.AndroidController;
		if(ac) ac.message("end of procGolfSchedule!")
	});
};
function mneCallDetail(date) {
	const param = { 
		clickTdId: 'A' + date,
		clickTdClass: '',
		workMonth: date.ct(2),
		workDate: date,
		bookgDate: '',
		bookgTime: '',
		bookgCourse: 'ALL',
		searchTime: '',
		macroChk: '',
		agreeYn: 'Y',
	};
	
	post('ajax/golfTimeList', param, {}, data => {
		const ifr = document.createElement('div');
		ifr.innerHTML = data;

		const tbl =ifr.getElementsByClassName('tbl')[0];
        const els = tbl.getElementsByTagName('tr');

		Array.from(els).forEach((el, i) => {
			if(i == 0) return;
			const course = el.children[1].innerText;
			const time = el.children[2].innerText;
			const fee_discount = el.children[5].innerText.split(',').join('') * 1;
			const fee_normal = el.children[4].innerText.split(',').join('') * 1;
			const holes = el.children[3].innerText;

			golf_schedule.push({
				golf_club_id: clubId,
				golf_course_id: course,
				date,
				time,
				in_out: '',
				persons: '',
				fee_normal,
				fee_discount,
				others: holes,
			});
		});
  });
}
function mneCall(date, callback) {
  const as = Array.from(document.getElementsByClassName('cal_live'));
  as.forEach((a) => {
    const obj = procStr(a.getAttribute('onclick'));
    dates.push([obj.date, obj.param]);
  });
  
  callback();
};
function procStr(str) {
	const regex = /\((.+)\)/;
	const values = regex.exec(str)[1].replace(/'/g,'').split(',');
	return { date: values[2], param: '' };
};