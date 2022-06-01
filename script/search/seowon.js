const clubId = 'b8802aa3-cdb5-11ec-a93e-0242ac11000a';
const courses = { 
	EAST: 'd853a1bb-cdb5-11ec-a93e-0242ac11000a',
	WEST: 'd853a3b1-cdb5-11ec-a93e-0242ac11000a',
	SOUTH: 'd853a3ec-cdb5-11ec-a93e-0242ac11000a',
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
}
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
    date: date,
    roundf: '1',
    _:'',
  };
  get('/hills/reservation/getTeeList.do', param, {}, (data) => {
    const objResp = JSON.parse(data).rows;
    const dict = {A: 'EAST', B: 'WEST', C: 'SOUTH'};
    objResp.forEach((obj) => {
      const course = dict[obj.BK_COS];
      const time = obj.BK_TIME.gh(2) + ":" + obj.BK_TIME.gt(2);
      const fee_normal = obj.BK_BASIC_CHARGE.replace(/\,/g, '') * 1;
      const fee_discount = obj.BK_BASIC_CHARGE.replace(/\,/g, '') * 1;
      
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
}
function mneCall(date, callback) {
    const param = {
        selYM: date,
        _: new Date().getTime(),
    };
    get("/hills/reservation/getCalendar.do", param, {}, data => {
        const json = JSON.parse(data);
        json.rows.forEach(ob => {
            if(ob.BK_TEAM * 1 === 0) return;
            dates.push([ob.CL_SOLAR, ""]);
        });
        callback();
    });
};