
const clubId = '88475b10-7c43-11ec-b15c-0242ac110005';
const courses = { 
	EAST: 'c76bca9f-7c43-11ec-b15c-0242ac110005', /* // 'EAST 코스', */ 
	WEST: 'c76bccf9-7c43-11ec-b15c-0242ac110005', /* // 'WEST 코스'  */
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + '/' + thismonth + '/01';

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + '/' + nextmonth + '/01';

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
    change_calendar(thisdate,'next');
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
		const [date, ] = dates[cnt];
		console.log('수집하기', cnt + '/' + lmt, date);
		mneCallDetail(date);
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
function mneCallDetail(date) {
	const param = { 
		day: date,
		change_day: '',
	};
	post('Booking/AjaxGetTime', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;
        
        const els = ifr.getElementsByTagName('li');
		const dictCourse = { 11: 'EAST', 22: 'WEST'};
		const obTeams = {};
		Array.from(els).forEach((el, i) => {
			const course = dictCourse[el.getAttribute('data-course')];
			const time = addColon(el.getAttribute('data-time'));
			const fee_discount = el.getAttribute('data-fee') * 1;
			const fee_normal = el.getAttribute('data-ori') * 1;
			const slot = time.gh(2);

			golf_schedule.push({
				golf_club_id: clubId,
				golf_course_id: course,
				date,
				time,
				in_out: '',
				persons: '',
				fee_normal,
				fee_discount,
				others: '',
			});
		});
    });
};
function mneCall(date, callback) {
	const param = {
		day: date,
		type: 'today',
		change_day: '',
	};
    post('Booking/AjaxCalendar', param, {}, data => {
		const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const els = ifr.getElementsByTagName('td');
		Array.from(els).forEach((el) => {
			if (el.className !== 'wait ') return;
			
			const date = el.getAttribute('data-day');
			dates.push([date, 0]);
		});
		callback();
    });
};
function addColon(str) {
	return str.gh(2) + ":" + str.gt(2);
};