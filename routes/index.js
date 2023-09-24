const express = require('express');
var router = express.Router();

const template = require('../lib/template');
const auth = require('../lib/authUtils');



// 홈(/)
router.get('/', (req, res) => {
	// console.log(req.session);
	// Session {
	// 	cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
	// 	is_logged: true,
	// 	nickname: 'muzom97',
	// 	__lastAccess: 1695296189129
	// }

	// passport 로그인 성공시 req에 user(=authData) 붙어오는지 확인
	// console.log('/', req.user);
	
	var title = 'Welcome';
	var description = 'Hello, node.js';

	var list = template.list(req.list);
	var html = template.html(title, list, 
		`
		<h2>${title}</h2>${description}
		<img src='/images/hello.jpg' style='width: 600px; display:block; margin:10px 0;'>
		`, 
		`<a href="/topic/create">CREATE</a>`,
		auth.isLogged(req),
		auth.getNickname(req)
	);

	res.send(html);
});


module.exports = router;