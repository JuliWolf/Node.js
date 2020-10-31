const http = require('http');
const fs = require('fs');

// function rqListener(req, res){
//
// }
// http.createServer(rqListener);

// const server = http.createServer((req, res) => {
//     // console.log(req.url, req.method, req.headers);
// //    To quit server
// //     process.exit();
// // How it usually Works
//     res.setHeader('Content-Type', 'text/html');
//     res.write('<html>');
//     res.write('<header><title>My First Page</title></header>');
//     res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
//     res.write('</html>');
//     res.end();
// });


// Send data and save data from input to the file
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<header><title>Enter Message</title></header>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"> <button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }else if(url === '/message' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFileSync('message.txt', message);
        });


        res.writeHead(302, {
            'Location': '/'
        });
        return res.end();
    }
});


server.listen(3000);