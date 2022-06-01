
const clubId = '1502b62e-85a9-11ec-b15c-0242ac110005';
const courses = { 
	IN: '37cd7dc5-85a9-11ec-b15c-0242ac110005',
	OUT: '37cd8023-85a9-11ec-b15c-0242ac110005',
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };

const now = new Date();
const thisyear = now.getFullYear() + "";
const thismonth = ("0" + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + '/' + thismonth + '/01';
console.log(thisdate);

const dates = [];
const result = [];
const golf_schedule = [];

mneCall(thisdate, procDate);

function procResultDataDetail(str) {
	const data = JSON.parse(str);
	if (data.resultCode !== 200) return;
	const result = [];
	dates.forEach(([date, teams, obTeams]) => {
		Object.keys(obTeams).forEach((course) => {
			if (Object.keys(obTeams[course]).length > 0) {
				const objCourse = {
					golf_club_id: clubId,
					date,
					course: courses[course],
					data: []
				};
				Object.keys(obTeams[course]).forEach((timeSlot, j) => {
					const arr = obTeams[course][timeSlot];
					objCourse.data.push({
						timeSlot: timeSlot + ":00",
						greenFee: arr[0].greenfee,
						teams: arr.length,
					});
				});
				result.push(objCourse);
			}
		});
	});
	
	const lmt = result.length - 1;
	let cnt = 0;
	const timer = setInterval(() => {
		const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/newGolfStatusDetail';
		const param = result[cnt];
		post(addrOuter, param, header, () => {});
		cnt++;
		if (cnt > lmt) {
			clearInterval(timer);
			setTimeout(() => {
				const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/detailCircuitEnd';
				post(addrOuter, { golf_club_id: clubId }, header, () => {});
			}, 1000);
		}
	}, 300);
};
function procResultData(date, obTeams, opt) {
	const ar = dates.find((arr) => arr[0] == date);
	ar.push(obTeams);
	if (!opt) return;

	dates.forEach(([dt, num, ob]) => {
		if (ob === undefined) return;
		Object.keys(ob).forEach((course) => {
			const courseNum = getSum(ob[course]);
			if (courseNum > 0) result.push({
				courseName: courses[course],
				date: dt,
				status: '가능',
				teams: courseNum
			});
		});
	});

	var addrOuter = OUTER_ADDR_HEADER + '/api/reservation/newGolfStatuses';
	var param = { golf_club_id: clubId, data: result };
	post(addrOuter, param, header, procResultDataDetail);
};
function getSum (ob) {
	let res = 0;
	Object.keys(ob).forEach((key) => {
		res += ob[key].length;
	});
	return res;
};
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
	const param = { golf_schedule, golf_club_id: clubId };
	post(addrOuter, param, header, () => {});
};
function mneCallDetail(arrDate) {
	const [date, strParam] = arrDate;
	const param = {};
	Array.from(aspnetForm.elements).forEach((el) => param[el.name] = el.value);
	param['ctl00$ContentPlaceHolder1$htbArgs'] = strParam;
	param['__EVENTTARGET'] = 'ctl00$ContentPlaceHolder1$btUp';	// 매우 중요. 생략금지!!!
	
	post('Reservation.aspx?choiceGolf=160', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;
        
		const tbl =ifr.getElementsByClassName('timeTbl')[1];
        const els = tbl.getElementsByTagName('tr');

		const obTeams = {};
		Array.from(els).forEach((el, i) => {
			const course = el.children[1].innerText;
			const time = el.children[2].innerText;
			const fee_discount = el.children[5].innerText.ct(1).split(',').join('') * 1;
			const fee_normal = el.children[4].innerText.ct(1).split(',').join('') * 1;
			const caddy = el.children[6].innerText;
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
				others: '9홀/' + caddy,
			});

			/* if(!obTeams[course]) obTeams[course] = {};
			if(!obTeams[course][slot]) obTeams[course][slot] = [];
			obTeams[course][slot].push({
				time,
				greenfee
			}); */
		});
		// callback(date, obTeams, opt);
    });
};
function mneCall(date, callback) {
	const param = {};
    get('Reservation.aspx', param, {}, data => {
		const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const els = ifr.getElementsByTagName('a');
		Array.from(els).forEach((el) => {
			const obj = procHref(el.href.toString());
			if (obj === undefined) return;
			dates.push([obj.date, obj.param]);
		});
		callback();
    });
};
function procHref(str) {
	if (str.indexOf('javascript:Update(\'LIST') === -1) return;
	const regex = /\((.+)\)/;
	const values = regex.exec(str)[1].replace(/'/g,'').split(',');
	return { date: str.split('|')[2].split('-').join(''), param: values[0] };
};