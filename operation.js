const fs = require("fs");
const log = console.log;
String.prototype.dp = function(param) {
    let self = this;
    const keys = Object.keys(param);
    keys.forEach(key => {
        const regex = new RegExp('\\$\\{'.add(key).add('\\}'), 'g');
        const val = param[key];
        self = self.replace(regex, val);
    });
    return self;
};
String.prototype.add = function add(str) {
    return [this, str].join('');
};

const template = fs.readFileSync("script/login/login_template.js", "utf-8");
const loginScript = fs.readFileSync("script/login/allday.js", "utf-8").split("\r\n").join("\r\n    ");


log(template.dp({ loginScript }));
