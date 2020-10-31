const users = require('./users');


const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.write('<html>');
        res.write('<header><title>Hello User</title></header>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="username"> <button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }else if(url === '/users'){
        res.write('<html>');
        res.write('<header><title>List of Users</title></header>');
        res.write('<body><ul>');
        users.forEach(user => {
            res.write(`<li>${user}</li>`);
        });
        res.write('</ul></body>');
        res.write('</html>');
        return res.end();
    }else if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const user = parsedBody.split("=")[1];
            console.log(user);
            res.writeHead(302, {
                'Location': '/users'
            });
            return res.end();
        });
    }
};

exports.handler = requestHandler;