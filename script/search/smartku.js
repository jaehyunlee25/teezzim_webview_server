const clubId = '54dc9b4b-ce15-11ec-a93e-0242ac11000a';
const courses = { 
	혼솔: '81bbcace-ce15-11ec-a93e-0242ac11000a', /* // '혼솔 코스',  */
	미쁨: '81bbccb0-ce15-11ec-a93e-0242ac11000a', /* // '미쁨 코스',  */
	바른: '81bbccea-ce15-11ec-a93e-0242ac11000a', /* // '바른 코스',  */
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
  mneCall(nextdate, procDate);
});

function procDate() {
  const lmt = dates.length - 1;
  let cnt = 0;
  const timer = setInterval(() => {
    /* // 마지막 수신 데이터까지 처리하기 위해 종료조건이 상단에 위치한다. */
    if(cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    /* // 데이터 수집 */
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
    golfrestype: "real",
    courseid: "0",
    usrmemcd: "11",
    pointdate: date,
    openyn: "1",
    dategbn: "3",
    choice_time: "00",
    cssncourseum: "",
    inputtype: "I",
  };
  post('real_timelist_ajax_list.asp', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;
    const trs = ifr.getElementsByTagName('tbody')[0].getElementsByTagName("tr");
    const obTeams = {};
    Array.from(trs).forEach((tr, i) => {
      const course = tr.children[1].innerHTML;
      const time = tr.children[2].innerHTML;
      const fee_normal = tr.children[4].innerHTML.replace(/\,/g,'') * 1;
      const fee_discount = tr.children[4].innerHTML.replace(/\,/g,'') * 1;

      golf_schedule.push({
        golf_club_id: clubId,
        golf_course_id: course,
        date,
        time,
        in_out: '',
        persons: '',
        fee_normal,
        fee_discount,
        others: '18홀',
      });
    });
  });
};
function mneCall(date, callback) {
  const param = {
    golfrestype: "real",
    schDate: date,
    usrmemcd: "11",
    toDay: date + "01",
    calnum: "1",
  };
  post('real_calendar_ajax_view.asp', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;
    
    const as = Array.from(ifr.getElementsByClassName('cal_live'));
    as.forEach((a) => {
      const str = a.getAttribute("href");
      const ob = procStr(str);
      dates.push([ob.date, 0]);
    });
    callback();
  });
};
function procStr(str) {
  const regex = /javascript:timefrom_change\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, '').split(',');
  return { date: values[0] };
};