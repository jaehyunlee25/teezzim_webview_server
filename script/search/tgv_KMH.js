
const clubId = 'b20397aa-7dea-11ec-b15c-0242ac110005';
const courses = { 
	단일: '1f06bc72-7deb-11ec-b15c-0242ac110005',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
    Update('CALENDAR|' + nextyear + '-' + nextmonth + '|');
    setTimeout(() => {
        mneCall(nextdate, procDate);
    }, 1000);
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
	post(addrOuter, param, header, () => {});
};
function mneCallDetail(arrDate) {
	const [date, strParam] = arrDate;
	const param = {
		strReserveDate: date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2),
		strGolfLgubun: 113,
	};
	
	get('/Mobile/Reservation/ReservationTimeList.aspx', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const tbl =ifr.getElementsByClassName('cosTable')[0];
        const els = tbl.getElementsByTagName('tr');

		const obTeams = {};
		Array.from(els).forEach((el, i) => {
            if(i === 0) return;
			const course = '단일';
			const time = el.children[1].children[0].innerText;
			const fee_discount = el.children[3].innerText.split(',').join('') * 1;
			const fee_normal = el.children[2].innerText.split(',').join('') * 1;

			golf_schedule.push({
				golf_club_id: clubId,
				golf_course_id: course,
				date,
				time,
				in_out: '',
				persons: '',
				fee_normal,
				fee_discount,
				others: '9홀',
			});
		});
    });
};
function mneCall(thisdate, callback) {
	const param = {};
    const els = document.getElementsByClassName('can');
    Array.from(els).forEach((el) => {
        const href = el.getAttribute("href");
        if(href === "#") return;
        const date = thisdate + el.innerText.addzero();
        dates.push([date, ""]);
    });
    callback();
};