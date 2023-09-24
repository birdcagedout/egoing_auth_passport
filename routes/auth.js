const express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');
// const url = require('url');
// const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');




module.exports = function(passport) {
	// 로그인(login)
	router.get('/login', (req, res) => {
		// console.log('/login 페이지 진입');

		var title = 'WEB - Login';

		var list = template.list(req.list);
		var html = template.html(title, list, 
			`
			<form action="/auth/login_process" method="post">
				<p>
					<label for="authId">E-mail</label>
					<input id="authId" type="text" name="email" placeholder="email" required autofocus>
				</p>
				<p>
					<label for="authPassword">Password</label>
					<input id="authPassword" type="password" name="password" placeholder="password">
				</p>
				<p>
					<input type="submit" value="Login">
				</p>
			</form>
		`, 
		'');

		res.send(html);
	});

	// 로그인 처리(login_process)
	router.post('/login_process',
		passport.authenticate('local', {successRedirect: '/', failureRedirect: '/auth/login'})
	);



	// 세션을 destroy할 때 redirection 전에 cookie를 지워주어야 한다.
	// https://github.com/valery-barysok/session-file-store/issues/26
	const options = require('../main');

	// 로그아웃(logout)
	router.get('/logout', (req, res) => {

		// 패스포트가 req.logout() 생성해주므로 호출하면 된다 
		// ==> req.user는 바로 없어지지만 session은 남아있을 수 있다
		req.logout( (err) => {
			if(err) throw err;
			req.session.save( (err) => {
				res.redirect('/');
			});
		});
	});

	return router;
}



