const fs = require('fs');

const requestHandler = (req, res) => {
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
            // fs.writeFileSync('message.txt', message);
            // async
            fs.writeFileSync('message.txt', message, () => {
                res.writeHead(302, {
                    'Location': '/'
                });
                return res.end();
            });
        });
    }
};

// module.exports = requestHandler;
module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text'
};

