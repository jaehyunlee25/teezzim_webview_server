const http = require('http');
const fs = require("fs");
const server = http.createServer((request, response) => {
    console.log('http request', request.method);
    if(request.method === "OPTION") {
        const defaultCorsHeader = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
            'Access-Control-Max-Age': 10
        };
    }
    if(request.method === "GET") {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write('hello, world!');
        response.end();
    }
    if(request.method === "POST") {
        response.writeHead(200, {'Content-Type': 'application/json'});
        let url;
        let script;
        if (request.url == "/island") {
            url = "https://www.islandresort.co.kr/html/member/login.asp?gopath=/html/reserve/reserve01.asp&b_idx=";
            script = "javascript:" + fs.readFileSync("island.js", "utf-8");
        } else if(request.url == "/jinyang") {
            url = "http://m.chinyangvalley.co.kr/member/login.asp";
            script = "javascript:" + fs.readFileSync("jinyang.js", "utf-8");
        }
        const objResp = {
            url,
            script,
        };
        console.log(objResp);
        response.write(JSON.stringify(objResp));
        response.end();
    }
    
    let body = [];
    request.on('data', (chunk) => {
        console.log(chunk);
        body.push(chunk.toString());
    }).on('end', () => {
        let data;
        try{
            data = JSON.parse(body.join(""));
        }catch(e){
            console.log(e);
        }
        console.log(data);
    });
}).listen(8080);
