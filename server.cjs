// server.js

const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// CORS 설정
server.use(cors());

server.use(middlewares);
server.use(router);

// JSON Server 실행
server.listen(3002, () => {
	console.log('JSON Server is running on port 3002');
});
