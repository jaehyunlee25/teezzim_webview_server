var clubId = '22b9c7f6-60f5-11ec-a49a-0242ac11000b';
var courseName = {
    A: '913cc460-60f5-11ec-a49a-0242ac11000b',
	B: '913cc7f1-60f5-11ec-a49a-0242ac11000b',
	C: '913cc8a5-60f5-11ec-a49a-0242ac11000b',
	D: '913cc8e3-60f5-11ec-a49a-0242ac11000b',
};
var OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { "Content-Type": "application/json" };
const golf_schedule = [];
const dates = [];
let lmt;

mneCall(procDate);
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
};
function procGolfSchedule() {
	golf_schedule.forEach((obj) => {
		obj.golf_course_id = courseName[obj.golf_course_id];
		obj.date = obj.date.gh(4) + '-' + obj.date.ch(4).gh(2) + '-' + obj.date.gt(2);
	});
	console.log(golf_schedule);
	const param = { golf_schedule, golf_club_id: clubId };
	post(addrOuter, param, header, () => {});
};
function mneCallDetail(arrDate) {
	const [date, course] = arrDate;
	const param = {
		resTabno: '1',
        weekNo: '1',
        wdate: date,
        wcrs: course,
        weekgb: '',
        flagcd2: '7',
        holecd: '2',
        eventGB: '',
        eventGB2: '',
        tgtUrl: '',
        date: '',
        roundDiv: '',
        gb: 'D',
        enc: '',
        cmd: '',
	};

	post('real_step02.jsp', param, {}, data => {
        const ifr = document.createElement('div');
        ifr.innerHTML = data;

		const els =ifr.getElementsByClassName('timeListCls');
		Array.from(els).forEach((el, i) => {
			const time = el.getAttribute("d2");
			const fee_discount = el.children[1].innerText.split(',').join('') * 1;
			const fee_normal = el.children[1].innerText.split(',').join('') * 1;

            console.log(date, course, time, fee_discount, fee_normal);

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

        procDate()
    });
};
function mneCall(callback) {
	const trs = Array.from(list_d2.getElementsByTagName("tr"));
    const result = [];
    const dict = {1: 'A', 2: 'B', 3: 'C', 4: 'D'};
    trs.forEach(tr => {
        const date = tr.getAttribute("dt1");
        Array.from(tr.children).forEach((td, i) => {        
            if(i === 0) return;
            if(i > 4) return;
            if(td.innerText === "") result.push([date, dict[i]]);
        });
    });
    result.forEach((arr) => {
        dates.push(arr);
    });
    callback();
};
