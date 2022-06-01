const clubId = '4c6747cf-774f-11ec-b15c-0242ac110005';
const courses = {
  IN: '566c55bb-775f-11ec-b15c-0242ac110005', // 'IN 코스',
  OUT: '566c584a-775f-11ec-b15c-0242ac110005', // 'OUT 코스'
};
const OUTER_ADDR_HEADER = 'https://dev.mnemosyne.co.kr';
const addrOuter = OUTER_ADDR_HEADER + '/api/reservation/golfSchedule';
const header = { 'Content-Type': 'application/json' };

const now = new Date();
const thisyear = now.getFullYear() + '';
const thismonth = ('0' + (1 + now.getMonth())).slice(-2);
const thisdate = thisyear + thismonth;

now.setMonth(now.getMonth() + 1);
const nextyear = now.getFullYear() + '';
const nextmonth = ('0' + (1 + now.getMonth())).slice(-2);
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
    // 마지막 수신 데이터까지 처리하기 위해 종료조건이 상단에 위치한다.
    if (cnt > lmt) {
      clearInterval(timer);
      procGolfSchedule();
      return;
    }
    // 데이터 수집
	  const [date] = dates[cnt];
	  console.log('수집하기', cnt + '/' + lmt, date);
    mneCallDetail(date);
    cnt++;
  }, 300);
};
function procGolfSchedule() {
  golf_schedule.forEach((obj) => {
    obj.golf_course_id = courses[obj.golf_course_id];
    obj.date =
      obj.date.gh(4) + '-' + obj.date.ch(4).gh(2) + '-' + obj.date.gt(2);
  });
  console.log(golf_schedule);
  const param = { golf_schedule, golf_club_id: clubId };
  post(addrOuter, param, header, () => {});
};
function mneCallDetail(date) {
  const param = {
    golfrestype: 'real',
    courseid: 0, // maybe 0: 전체, 1: IN, 2: OUT
    usrmemcd: 10,
    pointdate: date,
    openyn: 1,
    dategbn: 6,
    choice_time: '00',
    cssncourseum: '',
    inputtype: 1,
  };
  post('real_timelist_ajax_list.asp', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName('a');
    const obTeams = {};
    Array.from(as).forEach((a) => {
      const ob = procHrefDetail(a.href);
      if (!ob) return;
      const { course, time, fee_normal, fee_discount } = ob;
      const slot = time.gh(2);
      if (!obTeams[course]) obTeams[course] = {};
      if (!obTeams[course][slot]) obTeams[course][slot] = [];

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
    golfrestype: 'real',
    schDate: date,
    usrmemcd: 10,
    toDay: date + '01',
    calnum: 2,
  };
  post('real_calendar_ajax_view.asp', param, {}, (data) => {
    const ifr = document.createElement('div');
    ifr.innerHTML = data;

    const as = ifr.getElementsByTagName('a');
    Array.from(as).forEach((a) => {
      const ob = procHref(a.href);
      if (!ob) return;
      if (ob.type !== 'T') return;
      dates.push([ob.date, 0]);
    });
    callback();
  });
};
function procHrefDetail(str) {
  const head = str.indexOf('subcmd');
  if (head === -1) return false;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, '').split(',');
  return {
    time: addColon(values[2]),
    course: values[3],
    fee_normal: values[8] * 1,
    fee_discount: values[9] * 1,
  };
};
function addColon(str) {
  return str.gh(2) + ':' + str.gt(2);
};
function procHref(str) {
  const head = str.indexOf('timefrom_change');
  if (head === -1) return false;
  const regex = /\((.+)\)/;
  const values = regex.exec(str)[1].replace(/'/g, '').split(',');
  return { date: values[0], type: values[5] };
};