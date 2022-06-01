
const clubId = '4f44a7e1-7c51-11ec-b15c-0242ac110005';
const courses = { 
	Australasia: '90675d16-7c51-11ec-b15c-0242ac110005',
	Europe: '90675f42-7c51-11ec-b15c-0242ac110005',
	USA: '90675fb1-7c51-11ec-b15c-0242ac110005',
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
	post(addrOuter, param, header, () => {});
};
function mneCallDetail(date) {
	const param = { 
		day: date,
		course: '',
	};
	post('AjaxGetTime', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;
        
        const els = ifr.getElementsByTagName('tr');
		const dictCourse = { 11: 'Australasia', 22: 'Europe', 33: 'USA'};
		const obTeams = {};
		Array.from(els).forEach((el, i) => {
			const course = dictCourse[el.getAttribute('data-course')];
			const time = el.children[2].innerText;
			const fee_discount = el.children[4].innerText.split(',').join('') * 1;
			const fee_normal = el.children[3].innerText.split(',').join('') * 1;
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
	};
    post('Booking/AjaxCalendar', param, {}, data => {
		const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const els = ifr.getElementsByTagName('td');
		Array.from(els).forEach((el) => {
			if (el.children[0].tagName !== 'A') return;
			if (el.children[0].className !== 'reserved_hit') return;
			
			const realdate = date.split("/").join("").ct(2) + el.children[0].innerText.addzero();
			dates.push([realdate, 0]);
		});
		callback();
    });
};