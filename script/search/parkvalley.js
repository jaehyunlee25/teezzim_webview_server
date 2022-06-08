
const clubId = '20e579ca-cdb8-11ec-a93e-0242ac11000a';
const courses = { 
	PARK: '6809d971-cdb8-11ec-a93e-0242ac11000a',
	VALLEY: '6809dbb2-cdb8-11ec-a93e-0242ac11000a',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };

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

mneCall(thisdate, procDate);

function procDate() {
	const lmt = dates.length - 1; 
	let cnt = 0;
	const timer = setInterval(() => {
		if(cnt > lmt) {
			clearInterval(timer);
			procGolfSchedule();
			return;
		}
		const arrDate = dates[cnt];
		console.log('수집하기', cnt + '/' + lmt, arrDate[0]);
		mneCallDetail(arrDate);
		cnt++;
	}, 300);	
};
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
function mneCallDetail(arrDate) {
	const [date, strParam] = arrDate;
	const param = {};
	Array.from(aspnetForm.elements).forEach((el) => param[el.name] = el.value);
	param['__ASYNCPOST'] = 'true';
	param['ctl00$contents$htbArgs'] = strParam;
	param['ctl00$contents$ScptManager'] = 'ctl00$contents$ScptManager|ctl00$contents$lnkBtnUpd';
	param['__EVENTTARGET'] = 'ctl00$contents$lnkBtnUpd';
	
	post('ReservationCalendar.aspx', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const tbl =ifr.getElementsByClassName('timeTbl')[0];
        const els = tbl.getElementsByTagName('tr');

		Array.from(els).forEach((el, i) => {
            if(i === 0) return;
			const course = el.children[0].innerText;
			const time = el.children[1].innerText.ct(4);
			const fee_discount = el.children[3].innerText.ct(1).split(',').join('') * 1;
			const fee_normal = el.children[3].innerText.ct(1).split(',').join('') * 1;
			const holes = el.children[2].innerText;

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
};
function mneCall(date, callback) {
	const as = Array.from(document.getElementsByClassName('reserve'));
	as.forEach((a, i) => {
		if(i == 0) return;
		const obj = procHref(a.getAttribute('href'));
		dates.push([obj.date, obj.param]);
	});
	callback();
};
function procHref(str) {
	const regex = /\((.+)\)/;
	const values = regex.exec(str)[1].replace(/'/g,'').split(',');
	return { date: str.split('|')[2].split('-').join(''), param: values[0] };
};