const clubId = '8c895ca7-85b8-11ec-b15c-0242ac110005';
const courses = { 
	Birch: '69da50c7-85b9-11ec-b15c-0242ac110005',
	Pine: '69da53b1-85b9-11ec-b15c-0242ac110005',
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
    companyCd: 'J36',
    clickTdId: '',
    clickTdClass: '',
    workMonth: date.ct(2),
    workDate: date,
    bookgDate: '',
    bookgTime: '',
    bookgCourse: 'ALL',
    searchTime: '',
    temp001: '',
    bookgComment: '',
    agencyReservationYn: 'N',
    selfRYn: 'N',
    agreeYn: 'Y',
  };
  post('/reservation/ajax/golfTimeList', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;

    const trs = ifr.getElementsByTagName('tr');
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      if(i === 0) return;

      const course = tr.children[1].innerHTML;
      const time = tr.children[0].innerHTML;
      const fee_normal = tr.children[2].innerHTML.replace(/\,/g,'') * 1;
      const fee_discount = tr.children[4].innerHTML.replace(/\,/g,'') * 1;
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
        others: '9홀',
      });
    });
  });
};
function mneCall(date, callback) {
  const param = {
    companyCd: 'J36',
    clickTdId: '',
    clickTdClass: '',
    workMonth: date,
    workDate: date + '05',
    bookgDate: '',
    bookgTime: '',
    bookgCourse: '',
    searchTime: '',
    temp001: '',
    bookgComment: '',
    agencyReservationYn: 'N',
    selfRYn: 'N',
    agreeYn: 'Y',
  };
  post('/reservation/ajax/golfCalendar', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;

    const tbls = ifr.getElementsByClassName('cm_calender_tbl');
    let as = [];
    Array.from(tbls).forEach((tbl) => {
      const arr = Array.from(tbl.getElementsByTagName('a'));
      as = as.concat(arr);
    });

    as.forEach((a) => {
      if (a.className === 'cal_end') return;
      const str = a.getAttribute('onclick');
      if(str.indexOf('CLOSE') !== -1) return;
      if(str.indexOf('NOOPEN') !== -1) return;
      const ob = procStr(str);
      dates.push([ob.date, 0]);
    });
    callback();
  });
};
function procStr(str) {
  const regex = /clickCal\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, '').split(',');
  return { date: values[2] };
};