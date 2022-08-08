const http = require("http");
const mysql = require("mysql");
const fs = require("fs");
const admin = require("firebase-admin");
const serviceAccount = require("./teezzim-webview-test-firebase-adminsdk-i8hfk-ef88a22eeb.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const connection = mysql.createConnection(
  JSON.parse(fs.readFileSync("db.json"))
);
const log = function () {
  console.log("\n\n>> new log :: ", new Date());
  console.log(Array.from(arguments).join(", "));
};
const dir = console.dir;
const golfClubEngNames = [];
const golfClubIdToEng = {};
const golfClubIds = {};
const golfClubLoginUrl = {};
const golfClubLoginUrlByUUID = {};
const golfClubSearchUrl = {};
const golfClubReserveUrl = {};
const golfClubAccounts = {};
const golfCourseByEngId = {};
const golfCourseByUUID = {};
const LINE_DIVISION = "\n/* <============line_div==========> */\n";

connection.connect();
connection.query("select * from golf_club_eng;", getClubNames);
connection.query(fs.readFileSync("getLoginUrl.sql", "utf-8"), getLoginUrl);
connection.query(fs.readFileSync("getSearchUrl.sql", "utf-8"), getSearchUrl);
connection.query(fs.readFileSync("getReserveUrl.sql", "utf-8"), getReserveUrl);
connection.query(fs.readFileSync("getAccount.sql", "utf-8"), getAccounts);
connection.query(fs.readFileSync("golf_course.sql", "utf-8"), getGolfCourses);
connection.end();

function getGolfCourses(err, rows, fields) {
  rows.forEach(row => {
    if (!golfCourseByEngId[row.golf_club_english_name]) 
      golfCourseByEngId[row.golf_club_english_name] = [];
    golfCourseByEngId[row.golf_club_english_name].push(row);

    if (!golfCourseByUUID[row.golf_club_id]) 
      golfCourseByUUID[row.golf_club_id] = [];
    golfCourseByUUID[row.golf_club_id].push(row);
  });
}
function getAccounts(err, rows, fields) {
  rows.forEach((row) => {
    golfClubAccounts[row.golf_club_english_name] = {
      id: row.golf_club_login_url_admin_id,
      pw: row.golf_club_login_url_admin_pw,
    };
  });
  // console.log(golfClubAccounts);
}
function getClubNames(err, rows, fields) {
  rows.forEach((row) => {
    golfClubEngNames.push(row.eng_id);
    golfClubIds[row.eng_id] = row.golf_club_id;
    golfClubIdToEng[row.golf_club_id] = row.eng_id;
    // console.log(row.eng_id);
    // if(row.eng_id != "allday") fs.writeFileSync("script/search/" + row.eng_id + ".js", "");
  });
  // console.log(golfClubIds);
}
function getLoginUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginUrl[row.golf_club_english_name] =
      row.golf_club_login_url_mobile;
    golfClubLoginUrlByUUID[row.golf_club_uuid] = row.golf_club_login_url_mobile;
  });
  // console.log(golfClubLoginUrl);
}
function getSearchUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubSearchUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
  // console.log(golfClubSearchUrl);
}
function getReserveUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubReserveUrl[row.golf_club_english_name] =
      row.golf_club_search_url_mobile;
  });
}
const server = http
  .createServer((request, response) => {
    console.log("http request", request.method);
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*", // for same origin policy
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type", // for application/json
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    });
    if (request.method === "OPTIONS") {
      response.end(JSON.stringify({}));
      return;
    }
    let body = [];
    try {
      request
        .on("data", (chunk) => {
          console.log("test", chunk.toString());
          body.push(chunk.toString());
        })
        .on("end", () => {
          let data;
          data = body.join("");
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.log(data);
            return;
          }

          if (request.method === "GET") {
            response.write("hello, world!");
            response.end();
          }

          if (request.method === "POST") {
            try {
              procPost(request, response, data);
            } catch (e) {
              log(e);
            }
          }
        });
    } catch (e) {
      console.log(e);
    }
  })
  .listen(8080);
function procPost(request, response, data) {
  log("data", data);
  if (data.club && !golfClubAccounts[data.club]) {
    response.write(
      JSON.stringify({
        url: "",
        script: "",
      })
    );
    response.end();
    return;
  }

  let url;
  let script;
  let objResp;
  if (request.url == "/clubs") {
    const result = [];
    const clubIds = {};
    getClubs((rows) => {
      rows.forEach((row) => {
        result.push(row.eng_id);
        clubIds[row.eng_id] = row.id;
      });
      objResp = {
        clubs: result,
        clubIds,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;
  } else if (request.url == "/setReserveCancel") {
    objResp = setReserveCancel(data);
  } else if (request.url == "/setReserveSearch") {
    objResp = setReserveSearch(data);
  } else if (request.url == "/setReserveReserve") {
    objResp = setReserveReserve(data);
  } else if (request.url == "/account") {
    objResp = {
      accounts: golfClubAccounts,
    };
  } else if (request.url == "/search_core") {
    const engName = data.club;
    getSearchScript(engName, (script) => {
      const url = golfClubSearchUrl[engName];
      objResp = {
        url,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (request.url == "/set_pure_search_core") {
    const { club, part } = data;
    const engName = club;
    let core;
    try {
      console.log("read file");
      core = fs.readFileSync("script/search_core/" + engName + ".js", "utf-8");
    } catch (e) {
      console.log("error & read file");
      fs.writeFileSync(
        "script/search_core/" + engName + ".js",
        part.mneCall +
          LINE_DIVISION +
          part.mneCallDetail +
          LINE_DIVISION +
          part.function +
          LINE_DIVISION +
          part.command
      );
      response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
      response.end();
      return;
    }

    console.log("backup");
    // backup first
    fs.writeFileSync(
      "script/backup/search_core_" +
        new Date().getTime() +
        "_" +
        engName +
        ".js",
      core
    );

    // file save
    fs.writeFileSync(
      "script/search_core/" + engName + ".js",
      part.mneCall +
        LINE_DIVISION +
        part.mneCallDetail +
        LINE_DIVISION +
        part.function +
        LINE_DIVISION +
        part.command
    );

    response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
    response.end();
  } else if (request.url == "/get_pure_search_core") {
    const engName = data.club;
    let core = "";
    const part = {
      mneCall: [],
      mneCallDetail: [],
      function: [],
      command: [],
    };
    try {
      core = fs.readFileSync("script/search_core/" + engName + ".js", "utf-8");
    } catch (e) {
      fs.writeFileSync(
        "script/search_core/" + engName + ".js",
        LINE_DIVISION + LINE_DIVISION + LINE_DIVISION
      );
      response.write(JSON.stringify({ core, part }));
      response.end();
      return;
    }
    if (core.indexOf(LINE_DIVISION) == -1) {
      const arr = core.split("\n");
      let cursor;
      arr.forEach((ln, i) => {
        if (ln.indexOf("function mneCallDetail") != -1) {
          cursor = part.mneCallDetail;
        } else if (ln.indexOf("function mneCall") != -1) {
          cursor = part.mneCall;
        } else if (
          part.mneCall.length > 0 &&
          part.mneCallDetail.length > 0 &&
          ln.indexOf("function ") == 0
        )
          cursor = part.function;
        else if (ln.length > 1 && ln[0] != " ") cursor = part.command;
        cursor.push(ln);
      });
      part.mneCall = part.mneCall.join("\n");
      part.mneCallDetail = part.mneCallDetail.join("\n");
      part.function = part.function.join("\n");
      part.command = part.command.join("\n");
    } else {
      const parts = core.split(LINE_DIVISION);
      [part.mneCall, part.mneCallDetail, part.function, part.command] = parts;
    }
    response.write(JSON.stringify({ core, part }));
    response.end();
  } else if (request.url == "/get_pure_login") {
    const engName = data.club;
    let core = "";
    try {
      core = fs.readFileSync("script/login/" + engName + ".js", "utf-8");
    } catch (e) {
      fs.writeFileSync("script/login/" + engName + ".js", core);
    }
    response.write(JSON.stringify({ core }));
    response.end();
    return;
  } else if (request.url == "/set_pure_login") {
    const { engName, core } = data;
    // backup first
    fs.writeFileSync(
      "script/backup/login_" + new Date().getTime() + "_" + engName + ".js",
      core
    );
    // file save
    fs.writeFileSync("script/login/" + engName + ".js", core);
    response.write(JSON.stringify({ resultCode: 200, result: "okay" }));
    response.end();
  } else if (request.url == "/search") {
    console.log("url", request.url);
    const engName = data.club;
    const common = fs.readFileSync("script/search/common.js", "utf-8");
    /* const clubscript = fs.readFileSync(
      "script/search/" + engName + ".js",
      "utf-8"
    ); */
    getSearchScript(engName, (clubscript) => {
      console.log(clubscript);
      const script = "javascript:(() => {" + common + clubscript + "})()";
      const url = golfClubSearchUrl[engName];
      objResp = {
        url,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
  } else if (request.url == "/control") {
    /*
    controlForUserDevice(engName, "");
    */
    const engName = data.club;
    const sql = "getDeviceByClub.sql".gfdp({ engName });
    sql.query((err, rows, fields) => {
      if (rows.length === 0) {
        controlForAdminDevice(engName);
      } else {
        const top = rows[0];
        const std = new Date() - top.created_at;
        const m5 = 1000 * 60 * 5;
        if (std > m5) controlForAdminDevice(engName);
        else controlForUserDevice(engName, top.token);
      }
    });

    objResp = {};
  } else if (request.url == "/searchbot") {
    searchbot(data, (objResp) => {
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;
    /* const engName = data.club;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getLoginScript(engName, true);
    const templateScript = fs.readFileSync("template.js", "utf-8");
    getSearchScript(engName, (searchScript) => {
      const script = templateScript.dp({
        commonScript,
        loginUrl,
        searchUrl,
        loginScript,
        searchScript,
      });
      objResp = {
        url: loginUrl,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0; */
  } else if (request.url == "/searchbot_admin") {
    searchbot(data, (objResp) => {
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;
  } else if (request.url == "/searchbots_admin") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    let count = 0;

    exec();
    function exec() {
      const club = clubs[count];
      if(!club) {
        response.write(JSON.stringify({ urls, scripts, ids }));
        response.end();
        return;
      };
      searchbot({ club }, (objResp) => {
        urls[club] = objResp.url;
        scripts[club] = objResp.script;
        ids[club] = golfClubIds[club];        
        count++;
        exec();
      });
    }
    objResp = 0;
  } else if (request.url == "/reservebot") {
    objResp = reservebotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const reserveUrl = golfClubReserveUrl[engName];
    const loginScript = getPureLoginScript(engName);
    let templateScript;
    if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/reserve/" + engName + ".js",
        "utf-8"
      );
    else templateScript = fs.readFileSync("reserveTemplate.js", "utf-8");
    const script = templateScript.dp({
      year,
      month,
      date,
      course,
      time,
      commonScript,
      loginUrl,
      searchUrl,
      reserveUrl,
      loginScript,
    });
    objResp = {
      url: loginUrl,
      script,
    }; */
  } else if (request.url == "/reservebot_admin") {
    objResp = reservebotAdmin(data);
  } else if (request.url == "/reserveSearchbot") {
    objResp = reserveSearchbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const reserveUrl = golfClubReserveUrl[engName];
    const loginScript = getPureLoginScript(engName);
    let templateScript;
    if (fs.existsSync("script/reserve/search/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/search/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve/search/reserveSearchTemplate.js",
        "utf-8"
      );
    const golfClubId = golfClubIds[engName];
    const script = templateScript.dp({
      golfClubId,
      commonScript,
      loginUrl,
      reserveUrl,
      loginScript,
    });
    objResp = {
      url: loginUrl,
      script,
    }; */
  } else if (request.url == "/reserveSearchbots_admin") {
    const { clubs } = data;
    const urls = {};
    const scripts = {};
    const ids = {};
    clubs.forEach((club) => {
      const result = reserveSearchbotAdmin({ club });
      urls[club] = result.url;
      scripts[club] = result.script;
      ids[club] = golfClubIds[club];
    });
    objResp = { urls, scripts, ids };
  } else if (request.url == "/reserveSearchbot_admin") {
    objResp = reserveSearchbotAdmin(data);
  } else if (request.url == "/reserveCancelbot") {
    objResp = reserveCancelbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const reserveUrl = golfClubReserveUrl[engName];
    const loginScript = getPureLoginScript(engName);
    let templateScript;
    if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/cancel/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve/cancel/reserveCancelTemplate.js",
        "utf-8"
      );
    const golfClubId = golfClubIds[engName];
    const script = templateScript.dp({
      year,
      month,
      date,
      course,
      time,
      golfClubId,
      commonScript,
      loginUrl,
      reserveUrl,
      loginScript,
    });
    objResp = {
      url: loginUrl,
      script,
    }; */
  } else if (request.url == "/reserveCancelbot_admin") {
    objResp = reserveCancelbotAdmin(data);
    /* const { club: engName, year, month, date, course, time } = data;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const reserveUrl = golfClubReserveUrl[engName];
    const loginScript = getPureLoginScript(engName).dp({
      login_id: golfClubAccounts[engName].id,
      login_password: golfClubAccounts[engName].pw,
    });
    let templateScript;
    if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/cancel/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve/cancel/reserveCancelTemplate.js",
        "utf-8"
      );
    const golfClubId = golfClubIds[engName];
    const script = templateScript.dp({
      year,
      month,
      date,
      course,
      time,
      golfClubId,
      commonScript,
      loginUrl,
      reserveUrl,
      loginScript,
    });
    objResp = {
      url: loginUrl,
      script,
    }; */
  } else if (request.url == "/login") {
    const uuid = data.clubId;
    const engName = golfClubIdToEng[uuid];
    url = golfClubLoginUrl[engName];
    script = getLoginScript(engName);
    objResp = {
      url,
      script,
    };
  } else {
    const engName = request.url.substring(1);
    url = golfClubLoginUrl[engName];
    script = getLoginScript(engName);
    objResp = {
      url,
      script,
    };
  }
  if (objResp) {
    console.log("obj", objResp);
    response.write(JSON.stringify(objResp));
    response.end();
  }
}
function setReserveCancel(data) {
  if (!fs.existsSync("script/reserve_core/cancel/" + data.club))
    fs.mkdirSync("script/reserve_core/cancel/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/cancel/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_cancel_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/cancel/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_cancel_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/cancel/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_cancel_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveSearch(data) {
  if (!fs.existsSync("script/reserve_core/search/" + data.club))
    fs.mkdirSync("script/reserve_core/search/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/search/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_search_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/search/" + data.club + "/funcs.json";
  if (fs.existsSync(funcPath)) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_search_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath = "script/reserve_core/search/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_search_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function setReserveReserve(data) {
  if (!fs.existsSync("script/reserve_core/reserve/" + data.club))
    fs.mkdirSync("script/reserve_core/reserve/" + data.club);

  /* dict file backup */
  const dictPath = "script/reserve_core/reserve/" + data.club + "/dict.json";
  if (fs.existsSync(dictPath)) {
    const con = fs.readFileSync(dictPath);
    const backupPath = "script/backup/reserve_reserve_dict_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dictPath, JSON.stringify(data.dict), "utf-8");

  /* funcs file backup */
  const funcPath = "script/reserve_core/reserve/" + data.club + "/funcs.json";
  if (funcPath) {
    const con = fs.readFileSync(funcPath);
    const backupPath = "script/backup/reserve_reserve_funcs_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(funcPath, JSON.stringify(data.funcs), "utf-8");

  /* dictCourse file backup */
  const dcPath =
    "script/reserve_core/reserve/" + data.club + "/dictCourse.json";
  if (fs.existsSync(dcPath)) {
    const con = fs.readFileSync(dcPath);
    const backupPath = "script/backup/reserve_reserve_dictCourse_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(dcPath, JSON.stringify(data.dictCourse), "utf-8");

  /* splitterDate file backup */
  const sdPath = "script/reserve_core/reserve/" + data.club + "/splitterDate";
  if (sdPath) {
    const con = fs.readFileSync(sdPath);
    const backupPath = "script/backup/reserve_reserve_splitterDate_";
    const CT = new Date().getTime();
    const backupfile = backupPath + CT + "_" + data.club + ".json";
    fs.writeFileSync(backupfile, con, "utf-8");
  }
  fs.writeFileSync(sdPath, data.splitterDate, "utf-8");

  return {
    msg: "successfully saved!!",
    code: 200,
  };
}
function reserveCancelbotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/cancel/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/cancel/cancel_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/cancel/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/cancel/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/cancel/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/cancel/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/cancel/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/cancel/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/cancel/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/cancel/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: loginUrl, script };
}
function reserveSearchbotAdmin(data) {
  const { club: engName } = data;
  const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/search/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/search/search_common.js",
      "utf-8"
    );
    /** dict */
    const conDict = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dict.json",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDict);

    /** dictCourse */
    const conDictCourse = fs.readFileSync(
      "script/reserve_core/search/" + engName + "/dictCourse.json",
      "utf-8"
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(conDictCourse);

    /** funcs */
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/search/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/search/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/search/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/search/search_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(tmpCom.dp({ address_mapping, reserve_course_mapping }));
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/search/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/search/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/search/template.js",
        "utf-8"
      );
  }
  const golfClubId = golfClubIds[engName];
  const script = templateScript.dp({
    golfClubId,
    commonScript,
    loginUrl,
    reserveUrl,
    loginScript,
  });
  return { url: loginUrl, script };
}
function reservebotAdmin(data) {
  const { club: engName, year, month, date, course, time } = data;
  const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const reserveUrl = golfClubReserveUrl[engName];
  const loginScript = getPureLoginScript(engName);

  let templateScript;
  if (fs.existsSync("script/reserve_core/reserve/" + engName)) {
    const tmpResult = ["javascript:(() => {"];
    const tmpCom = fs.readFileSync(
      "script/reserve_core/reserve/reserve_common.js",
      "utf-8"
    );
    const address_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      json.forEach((ar) => {
        obj.push(['  "' + ar[1] + '"', ar[2]].join(": "));
      });
      obj.push();
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dict.json",
        "utf-8"
      )
    );
    const reserve_course_mapping = ((strDate) => {
      const json = JSON.parse(strDate);
      let obj = [];
      Object.keys(json).forEach((key) => {
        obj.push(["  " + key, '"' + json[key].trim() + '"'].join(": "));
      });
      obj = [obj.join(",\r\n")];
      obj.unshift("{");
      obj.push("}");
      return obj.join("\r\n");
    })(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/dictCourse.json",
        "utf-8"
      )
    );
    const splitter_date = fs.readFileSync(
      "script/reserve_core/reserve/" + engName + "/splitterDate",
      "utf-8"
    );
    const funcs = JSON.parse(
      fs.readFileSync(
        "script/reserve_core/reserve/" + engName + "/funcs.json",
        "utf-8"
      )
    );
    if (!funcs.funcLogin) {
      if (fs.existsSync("script/reserve/reserve/" + engName + ".js")) {
        const oldFuncs = getFunc(
          fs.readFileSync("script/reserve/reserve/" + engName + ".js", "utf-8")
        );
        funcs.funcLogin = oldFuncs.funcLogin;
      } else {
        funcs.funcLogin = fs.readFileSync(
          "script/reserve_core/reserve/reserve_login.js",
          "utf-8"
        );
      }
    }
    tmpResult.push(
      tmpCom.dp({ address_mapping, reserve_course_mapping, splitter_date })
    );
    Object.keys(funcs).forEach((key) => {
      const func = funcs[key];
      tmpResult.push(func);
    });
    tmpResult.push("})();");
    templateScript = tmpResult.join("\r\n");
  } else {
    if (fs.existsSync("script/reserve/reserve/" + engName + ".js"))
      templateScript = fs.readFileSync(
        "script/reserve/reserve/" + engName + ".js",
        "utf-8"
      );
    else
      templateScript = fs.readFileSync(
        "script/reserve_core/reserve/template.js",
        "utf-8"
      );
  }
  const script = templateScript.dp({
    year,
    month,
    date,
    course,
    time,
    commonScript,
    loginUrl,
    searchUrl,
    reserveUrl,
    loginScript,
  });
  return { url: loginUrl, script };
}
function searchbot(data, callback) {
  const engName = data.club;
  const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getLoginScript(engName, true);
  const templateScript = fs.readFileSync("template.js", "utf-8");
  getSearchScript(engName, (searchScript) => {
    const script = templateScript.dp({
      commonScript,
      loginUrl,
      searchUrl,
      loginScript,
      searchScript,
    });
    objResp = {
      url: loginUrl,
      script,
    };
    callback(objResp);
  });
  /* const engName = data.club;
  const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
  const loginUrl = golfClubLoginUrl[engName];
  const searchUrl = golfClubSearchUrl[engName];
  const loginScript = getPureLoginScript(engName);
  const address_mapping = ((strDate) => {
    const json = JSON.parse(strDate);
    let obj = [];
    json.forEach((ar) => {
      obj.push(['  "' + ar[1], ar[2]].join('": '));
    });
    obj = [obj.join(",\r\n")];
    obj.unshift("{");
    obj.push("}");
    return obj.join("\r\n");
  })(
    fs.readFileSync(
      "script/reserve_core/reserve/" + engName + "/dict.json",
      "utf-8"
    )
  );
  const funcs = JSON.parse(
    fs.readFileSync(
      "script/reserve_core/reserve/" + engName + "/funcs.json",
      "utf-8"
    )
  );
  const endoutScript = [funcs.funcEnd, funcs.LOGOUT].join("\r\n");
  const templateScript = fs.readFileSync("template.js", "utf-8");
  getSearchScript(engName, (searchScript) => {
    const script = templateScript.dp({
      commonScript,
      loginUrl,
      searchUrl,
      loginScript,
      searchScript,
      address_mapping,
      endoutScript,
    });
    objResp = {
      url: loginUrl,
      script,
    };
    callback(objResp);    
  }); */
  
}
function getFunc(code) {
  code = code.split("\r\n").join("\n");
  code = code.split("\n").join("\r\n");
  let pCount = 0;
  const funcs = {};
  const resEls = [];
  let curFunc = "";
  code.split("\r\n").forEach((ln) => {
    const regex = /\s?function\s([a-zA-Z]+)\s?\(/;
    const res = regex.exec(ln);
    if (!pCount && res) {
      curFunc = res[1];
      funcs[curFunc] = [ln];

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;

      return;
    }
    if (pCount) {
      funcs[curFunc].push(ln);

      let plus = ln.howmany("{");
      let minus = ln.howmany("}");

      pCount += plus - minus;
      return;
    }
    resEls.push(ln);
  });
  Object.keys(funcs).forEach((key) => {
    const func = funcs[key];
    funcs[key] = func.join("\r\n");
  });
  return funcs;
}
function getClubs(callback) {
  const connection = mysql.createConnection(
    JSON.parse(fs.readFileSync("db.json", "utf-8"))
  );
  connection.connect();
  connection.query(
    fs.readFileSync("getSearchClubs.sql", "utf-8"),
    (err, rows, fields) => {
      callback(rows);
    }
  );
}
function controlForUserDevice(engName, token) {
  token =
    "dybWCsvWR1KXBSlgTU1ocg:APA91bGM8fzGQy3c9shE4ZKywouYAD-ZYRZDJjgA60U4tOV7HeQyNJW01nTUi5bIf2B_dkVXtRBv75HpTrg70UnX0DurwwvWckOLyZzrmt5Kk5MIiluUfDX0O1M1fo2CegVNlqzirWp8";
  console.log(token);
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    // topic: "search",
    token,
  };
  console.log(message);
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function controlForAdminDevice(engName) {
  const message = {
    data: {
      command: "search",
      club: engName,
      club_id: golfClubIds[engName],
    },
    topic: "admin",
    // token,
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
function getSearchScript(engName, callback) {
  const golfClubId = golfClubIds[engName];  
  const param = {
    golf_club_id: "",
    golf_course: [],
  };
  log("course", engName, golfCourseByEngId[engName]);
  golfCourseByEngId[engName].forEach((course, i) => {
    if (i === 0) param.golf_club_id = course.golf_club_id;
    param.golf_course.push(
      [
        "'" + course.golf_course_name + "'",
        ": '",
        course.golf_course_id,
        "',",
      ].join("")
    );
  });
  param.golf_course = param.golf_course.join("\r\n\t");
  const template = gf("search_template.js").dp(param);
  console.log(template);
  const common = gf("search_template2.js").add(gf("search_template3.js"));
  const core = fs.readFileSync(
    "script/search_core/" + engName + ".js",
    "utf-8"
  );
  let wrapper;
  try {
    wrapper = fs.readFileSync(
      "script/search_wrapper/" + engName + ".js",
      "utf-8"
    );
  } catch (e) {
    console.log(e.toString());
  }

  let script;
  if (wrapper)
    script = wrapper.dp({ searchScript: template + common + core });
  else script = template + common + core;
  callback(script.dp({ golfClubId }));
}
function getPureLoginScript(engName) {
  const golfClubId = golfClubIds[engName];
  const cover = fs.readFileSync("script/login/cover.template", "utf-8");
  const template = fs.readFileSync("script/login/login.template", "utf-8");
  const common = "";
  let loginScript;
  let loginContent;
  try {
    loginScript = fs
      .readFileSync("script/login/" + engName + ".js", "utf-8")
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function getLoginScript(engName, noCover) {
  const golfClubId = golfClubIds[engName];
  const cover = fs.readFileSync("script/login/cover.template", "utf-8");
  const template = fs.readFileSync("script/login/login.template", "utf-8");
  const common = fs.readFileSync("script/search/common.js", "utf-8");
  let loginScript;
  let loginContent;
  try {
    loginScript = fs
      .readFileSync("script/login/" + engName + ".js", "utf-8")
      .split("\r\n")
      .join("\r\n    ");
    loginContent = template.dp({ common, loginScript, golfClubId });
    console.log("noCover", noCover);
    if (noCover == undefined) loginContent = cover.dp({ loginContent });
  } catch (e) {
    loginContent = "no login script";
  }
  return loginContent;
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}

String.prototype.dp = function (param) {
  let self = this;
  const keys = Object.keys(param);
  keys.forEach((key) => {
    const regex = new RegExp("\\$\\{".add(key).add("\\}"), "g");
    const val = param[key];
    self = self.replace(regex, val);
  });
  return self;
};
String.prototype.add = function add(str) {
  return [this, str].join("");
};
String.prototype.jp = function () {
  return JSON.parse(this);
};
String.prototype.gf = function () {
  const path = this.toString();
  return fs.readFileSync(path, "utf-8");
};
String.prototype.gfjp = function () {
  return this.toString().gf().jp();
};
String.prototype.gfdp = function (param) {
  return this.toString().gf().dp(param);
};
String.prototype.query = function (callback) {
  const sql = this.toString();
  const dbconf = "db.json";
  const connection = mysql.createConnection(dbconf.gfjp());
  connection.connect();
  connection.query(sql, callback);
};
String.prototype.howmany = function (str) {
  let num = this.match(new RegExp(str, "g"));
  if (!num) num = 0;
  else num = num.length;
  return num;
};
