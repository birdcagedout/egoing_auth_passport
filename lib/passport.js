

module.exports = function(app) {
	
	// PASSPORT: 내부적으로 session을 사용하므로 session 다음에 위치시킨다
	var passport = require('passport');
	var LocalStrategy = require('passport-local');
	var crypto = require('crypto');

	const authData = {
		email: 'muzom97@naver.com',
		password: '1111',
		nickname: 'muzom97'
	};	


	// 패스포트 사용 전 필수
	app.use(passport.initialize());
	app.use(passport.session());


	// 로그인 성공시 딱1번 user정보를 session store에 저장하는 함수
	passport.serializeUser(function(user, done) {
		// console.log('serializeUser', user);
		done(null, user.email);
		// done(null, user.id);
	});

	// 어떤 페이지에 접속할 때마다 로그인한 사용자인지 확인하기 위해 session store의 값 불러오는 함수
	passport.deserializeUser(function(id, done) {
		console.log('deserializeUser', id);
		done(null, authData);										// 방문한 페이지 라우터의 콜백에서 req.user로 authData가 전달됨
		/* User.findById(id, function(err, user) {
			done(err, user);
		}); */
	});


	passport.use(new LocalStrategy(
		// 폼의 name 변경: email, password
		{
			usernameField: 'email',
			passwordField: 'password'
		},

		// 폼이 전송되었을 때 호출: 로그인 성공/실패를 판별하여 done 호출
		function(username, password, done) {
			// console.log('LocalStrategy', username, password);			// username, password에 email과 password가 들어오는지 확인

			if(username === authData.email) {
				// console.log('email 확인끝');
				if(password === authData.password) {
					// console.log('password 확인끝');
					return done(null, authData);			// req.user에 authData가 붙는다
				} 
				// password가 틀린 경우
				else {
					return done(null, false, {message: "Incorrect password!"});
				}
			} 
			// email이 틀린 경우
			else {
				return done(null, false, {message: "Incorrect username!"});
			}
		}
	));

	return passport;

}


