const clubId = 'f064cc85-e3be-11ec-a93e-0242ac11000a';
const courses = { 
	'바다': '130efef8-e3bf-11ec-a93e-0242ac11000a',
	'푸른': '130f00d9-e3bf-11ec-a93e-0242ac11000a',
	'하늘': '130f0117-e3bf-11ec-a93e-0242ac11000a',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { 'Content-Type': 'application/json' };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28);
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);

const dates = [];
const result = [];
const golf_schedule = [];
let lmt;

mneCall(thisdate, () => {
	mneCall(nextdate, procDate);
});

function procDate() {
	if(lmt === undefined) lmt = dates.length - 1;
	const order = lmt - dates.length + 1;
	const arrDate = dates.shift();
	if(arrDate) {
        console.log('수집하기', order + '/' + lmt, arrDate[0]);
        mneCallDetail(arrDate);
    } else {
        procGolfSchedule();
    }
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
function mneCallDetail(arrDate) {
	const [date, course] = arrDate;
	const param = { 
		book_date: date,
        ThisDate: date,
	};

	post('reserve01_step1.asp', param, {}, data => {
		const ifr = document.createElement('div');
		ifr.innerHTML = data;

		const tbody = ifr.getElementsByTagName("tbody")[0];
        const Sea = tbody.children[0].children[0];
        const Blue = tbody.children[0].children[1];
        const tds = [Sea, Blue];
		tds.forEach((td, i) => {			
			const btns = td.getElementsByTagName("button");
			Array.from(btns).forEach(btn => {
                const strOnclick = btn.getAttribute("onclick");
                const regex = /\((.+)\)/;
	            const values = regex.exec(strOnclick)[1].replace(/'/g, '').split(',');
                const course = values[3];
				const time = values[4];
				const fee_discount = 125000;
				const fee_normal = 125000;
	
				golf_schedule.push({
					golf_club_id: clubId,
					golf_course_id: course,
					date,
					time,
					in_out: '',
					persons: '',
					fee_normal,
					fee_discount,
					others: "9홀",
				});
			});
		});
		procDate();
	});
};
function mneCall(date, callback) {
	const param = {
		ThisDate: date,
	};
	post("reserve01.asp", param, {}, data => {
		const ifr = document.createElement('div');
		ifr.innerHTML = data;
		const btns = ifr.getElementsByClassName("book");
		Array.from(btns).forEach(btn => {
			const str = btn.getAttribute("onclick");
			const vals = procHref(str);
			dates.push([vals.date, ""]);
		});
        console.log(dates);
		callback();
	});
};
function procHref(str) {
	const regex = /\((.+)\)/;
	const values = regex.exec(str)[1].replace(/'/g, '').split(',');	
	return { date: values.join(""), type: "" };
};