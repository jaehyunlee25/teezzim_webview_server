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
const log = console.log;
const dir = console.dir;
const golfClubEngNames = [];
const golfClubIdToEng = {};
const golfClubIds = {};
const golfClubLoginUrl = {};
const golfClubLoginUrlByUUID = {};
const golfClubSearchUrl = {};
const golfClubAccounts = {};
const LINE_DIVISION = "\n/* <============line_div==========> */\n";

connection.connect();
connection.query("select * from golf_club_eng;", getClubNames);
connection.query(fs.readFileSync("getLoginUrl.sql", "utf-8"), getLoginUrl);
connection.query(fs.readFileSync("getSearchUrl.sql", "utf-8"), getSearchUrl);
connection.query(fs.readFileSync("getAccount.sql", "utf-8"), getAccounts);
connection.end();
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
          try {
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
              procPost(request, response, data);
            }
          } catch (e) {
            console.log(e);
          }
        });
    } catch (e) {
      console.log(e);
    }
  })
  .listen(8080);
function procPost(request, response, data) {
  console.log("data", data);
  let url;
  let script;
  let objResp;
  if (request.url == "/clubs") {
    objResp = {
      clubs: golfClubEngNames,
    };
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
    const engName = data.club;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getLoginScript(engName, true).dp({
      login_id: golfClubAccounts[engName].id,
      login_password: golfClubAccounts[engName].pw,
    });
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
    objResp = 0;
  } else if (request.url == "/reservebot") {
    const engName = data.club;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getLoginScript(engName, true).dp({
      login_id: golfClubAccounts[engName].id,
      login_password: golfClubAccounts[engName].pw,
    });
    const templateScript = fs.readFileSync("reserveTemplate.js", "utf-8");
    getReserveScript(engName, (reserveScript) => {
      const script = templateScript.dp({
        commonScript,
        loginUrl,
        searchUrl,
        loginScript,
        reserveScript,
      });
      objResp = {
        url: loginUrl,
        script,
      };
      response.write(JSON.stringify(objResp));
      response.end();
    });
    objResp = 0;
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
  const result = {};
  const connection = mysql.createConnection(
    JSON.parse(fs.readFileSync("db.json", "utf-8"))
  );
  connection.connect();
  connection.query(
    fs.readFileSync("golf_course.sql", "utf-8"),
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        return;
      }
      rows.forEach((row) => {
        if (!result[row.golf_club_english_name])
          result[row.golf_club_english_name] = [];
        result[row.golf_club_english_name].push(row);
      });
      const param = {
        golf_club_id: "",
        golf_course: [],
      };
      result[engName].forEach((course, i) => {
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
  );
}
function getReserveScript(engName, callback) {
  const golfClubId = golfClubIds[engName];
  callback("console.log('" + golfClubId + "')");
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
