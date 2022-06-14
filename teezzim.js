const http = require("http");
const mysql = require("mysql");
const fs = require("fs");
const admin = require("firebase-admin");
const serviceAccount = require("./teezzim-webview-test-firebase-adminsdk-i8hfk-ef88a22eeb.json");
const token =
  "dojdZqaQRR-Xf-7sl05bY6:APA91bGNoMmJZZTERSqD311_6GTtAZoZH2ZTStXbrEZ6vCMTa50dkcD0xf64LfbOJHgtjtGeUcnI_VwgexrNbLY0bB30AbtW9jlImnkQDRF2jFyXqewSvQJ_yCFP22OcwUGa9MUCYRIp";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const connection = mysql.createConnection(
  JSON.parse(fs.readFileSync("db.json"))
);
const golfClubEngNames = [];
const golfClubIds = {};
const golfClubLoginUrl = {};
const golfClubSearchUrl = {};
const golfClubAccounts = {};

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
    // console.log(row.eng_id);
    // if(row.eng_id != "allday") fs.writeFileSync("script/search/" + row.eng_id + ".js", "");
  });
  // console.log(golfClubIds);
}
function getLoginUrl(err, rows, fields) {
  rows.forEach((row) => {
    golfClubLoginUrl[row.golf_club_english_name] =
      row.golf_club_login_url_mobile;
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
            console.log(data);
            data = JSON.parse(body.join(""));

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
    const engName = data.club;
    const message = {
      data: {
        command: "search",
        club: engName,
        club_id: golfClubIds[engName],
      },
      topic: "search",
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
    objResp = {};
  } else if (request.url == "/searchbot") {
    const engName = data.club;
    const commonScript = fs.readFileSync("script/search/common.js", "utf-8");
    const loginUrl = golfClubLoginUrl[engName];
    const searchUrl = golfClubSearchUrl[engName];
    const loginScript = getLoginScript(engName).dp({
      login_id: golfClubAccounts[engName].id,
      login_password: golfClubAccounts[engName].pw,
    });
    const searchScript = fs.readFileSync(
      "script/search/" + engName + ".js",
      "utf-8"
    );
    const templateScript = fs.readFileSync("template.js", "utf-8");
    const script = templateScript.dp({
      commonScript,
      loginUrl,
      searchUrl,
      loginScript,
      searchScript,
    });
    fs.writeFileSync("templateResult.js", script);
    objResp = {
      url: loginUrl,
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
function getSearchScript(engName, callback) {
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
      callback(script);
    }
  );
}
function getLoginScript(engName) {
  const golfClubId = golfClubIds[engName];
  const template = fs.readFileSync("script/login/login.template", "utf-8");
  const common = fs.readFileSync("script/search/common.js", "utf-8");
  const loginScript = fs
    .readFileSync("script/login/" + engName + ".js", "utf-8")
    .split("\r\n")
    .join("\r\n    ");
  return template.dp({ common, loginScript, golfClubId });
}
function gf(file) {
  //get file
  return fs.readFileSync(file, "utf-8");
}
function jp(str) {
  return JSON.parse(str);
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
