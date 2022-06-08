const clubId = 'db1f13aa-e3ef-11ec-a93e-0242ac11000a';
const courses = { 
	'스톤': 'ed77d27c-e3ef-11ec-a93e-0242ac11000a',
	'게이트': 'ed77d4ff-e3ef-11ec-a93e-0242ac11000a',
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
	const param = {};
    Array.from(aspnetForm.elements).forEach((el) => param[el.name] = el.value);
    param['ctl00$ContentPlaceHolder1$scManager'] = "ctl00$ContentPlaceHolder1$scManager|ctl00$ContentPlaceHolder1$btnUp";
    param['ctl00$ContentPlaceHolder1$hdfParam'] = "CALENDAR|" + date.gh(4) + "-" + date.ch(4).gh(2) + "-01|";
    param['SelectedDate'] = date.gh(4) + "-" + date.ch(4).gh(2) + "-" + date.gt(2);
    param['__ASYNCPOST'] = true;

	post('ReservationTimeList.aspx', param, {}, data => {
		const ifr = document.createElement('div');
		ifr.innerHTML = data;

		const table = ifr.getElementsByClassName("timeTbl")[0];
        const tbody = table.getElementsByTagName("tbody")[0];
        const trs = tbody.children;
        Array.from(trs).forEach(tr => {
            const course = tr.children[0].innerText;
            const time = tr.children[1].innerText.gh(5).replace(/\s/g,"").split(":").join("");
            const fee_discount = tr.children[3].innerText.replace(/\s/g,"").ct(1).split(',').join('') * 1;
            const fee_normal = tr.children[4].innerText.replace(/\s/g,"").ct(1).split(',').join('') * 1;

            golf_schedule.push({
                golf_club_id: clubId,
                golf_course_id: course,
                date,
                time,
                in_out: '',
                persons: '',
                fee_normal,
                fee_discount,
                others: "18홀",
            });
        });
		procDate();
	});
};
function mneCall(date, callback) {
	const param = {};
    Array.from(aspnetForm.elements).forEach((el) => param[el.name] = el.value);
    param['ctl00$ContentPlaceHolder1$scManager'] = "ctl00$ContentPlaceHolder1$scManager|ctl00$ContentPlaceHolder1$btnUp";
    param['ctl00$ContentPlaceHolder1$hdfParam'] = "CALENDAR|" + date.gh(4) + "-" + date.ch(4).gh(2) + "-01|";
    param['__ASYNCPOST'] = true;
	post("Reservation.aspx", param, {}, data => {
		const ifr = document.createElement('div');
		ifr.innerHTML = data;
		const as = ifr.getElementsByClassName("reserv");
		Array.from(as).forEach(a => {
			const str = a.getAttribute("href");
			const vals = procHref(str);
			dates.push([vals.date, ""]);
		});
		callback();
	});
};
function procHref(str) {
	const regex = /\((.+)\)/;
	const values = regex.exec(str)[1].replace(/'/g, '').split(',');	
	return { date: values[0].split("-").join(""), type: "" };
};