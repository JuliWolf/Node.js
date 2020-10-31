const http = require('http');

const routes = require('./routes');

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
const server = http.createServer(routes.handler);


server.listen(3000);