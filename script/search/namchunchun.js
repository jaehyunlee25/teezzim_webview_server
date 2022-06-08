
const clubId = 'd26b37e1-7437-11ec-b15c-0242ac110005';
const courses = { 
	challenge: '9a7f66ea-7438-11ec-b15c-0242ac110005',
	victory: '9a7f6471-7438-11ec-b15c-0242ac110005',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setDate(28); /* 31일 오류 방지 */
now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + "";
const nextmonth = ("0" + (1 + now.getMonth())).slice(-2);
const nextdate = nextyear + nextmonth;

console.log(thisdate, nextdate);
const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, () => {
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
	post('/html/reservation/reservation_01_01.asp', { book_date_bd: date }, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;
        
        const tds = ifr
					.getElementsByClassName('course_list_table')[1]
					.getElementsByTagName('tbody')[0]
					.children[0]
					.children;
		const [victory, challenge] = tds;
		const obTeams = {victory: {}, challenge: {}};

		Array.from(victory.children).forEach((div) => {
			const str = div.innerText;
			const time = str.gh(2);
			const fee_discount = div.children[1].innerText.ch(1).replace(/,/g,'') * 1;
			const fee_normal = div.children[0].innerText.ch(1).replace(/,/g,'') * 1;

			golf_schedule.push({
				golf_club_id: clubId,
				golf_course_id: 'victory',
				date,
				time: str.gh(5),
				in_out: '',
				persons: '',
				fee_normal,
				fee_discount,
				others: '',
			});
		});
		Array.from(challenge.children).forEach((div) => {
			const str = div.innerText;
			const time = str.gh(2);
			const fee_discount = div.children[1].innerText.ch(1).replace(/,/g,'') * 1;
			const fee_normal = div.children[0].innerText.ch(1).replace(/,/g,'') * 1;
			golf_schedule.push({
				golf_club_id: clubId,
				golf_course_id: 'challenge',
				date,
				time: str.gh(5),
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
    post('/html/reservation/reservation_01_01.asp', {book_date_bd: date}, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;
        
        const date = ifr.getElementsByClassName('plan-month2')[0].getElementsByTagName('span')[0];
        const year = date.children[0].innerHTML;
        const month = date.children[1].innerHTML;
    
        const tables = ifr.getElementsByTagName('table');
        const tblOverView = tables[0];
        const tblDetail = tables[2];
    
        const tdDays = tblOverView.getElementsByClassName('gray');
        Array.from(tdDays).forEach((td) => {
            const text = td.innerText.trim().gh(2);
            const team = td.innerText.trim().ch(2).ct(1);
            dates.push([year + month + text, team]);
        });
		callback();
    });
};