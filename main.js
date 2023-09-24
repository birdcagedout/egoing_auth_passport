// 생활코딩(egoing)님의 WEB4 Express Session & Auth 강의
// 블로그: https://opentutorials.org/module/3648
// 유튜브: https://www.youtube.com/playlist?list=PLuHgQVnccGMCHjWIDStjaZA2ZR-jwq-WU
// 4단계. 라우팅까지 완료



const fs = require('fs');
const helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



const express = require('express');
const app = express();
const port = 3000;


// 보안 기본 설정
app.use(helmet());


// 미들웨어(body-Parser) body-parser: (클라이언트의) 폼 데이터 POST 요청 처리, req.body라는 프로퍼티가 생긴다
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));		// 다른 경로의 router 파일에도 똑같이 적용


// 미들웨어(body-Parser) compression: 사용시 텍스트 파일 전송 67.5KB -> 5KB
const compression = require('compression');
app.use(compression());




// 세션 설치
// - secret(필수): session ID cookie를 sign할 때 필요한 스트링, parsing 예측 불가한 랜덤한 게 제일 좋음 ==> 기본문자열 + 클라이언트 식별문자열 + 시간적 요소(매번 바뀌면 매번 새로운 세션 생성되므로 안 됨)
// - resave(옵션): session값이 변경되지 않았어도 무조건 store에 저장할지 여부. false이면 session값이 바뀌었을 때만 store에 저장한다. ==> 무조건 false 추천
// - saveUninitialized(옵션): initialize되지 않은 세션도 강제로 store에 저장할지 여부. false이면 session이 필요하기 전(로그인 전)까지는 session을 store로 저장하지 않는다.

var options = {
	// secret: 'sunw001010' + 'grpay' + new Date(),		// secret.split('grpay') ==> [ 'sunw001010', 'Thu Sep 21 2023 18:52:07 GMT+0900 (Korean Standard Time)' ]
	secret: 'sunw001010' + 'grpay',
  resave: false,
  saveUninitialized: true,
	store: new FileStore(),
	// name: 'my_session_id',		// 기본값은 connect.sid
	// secure: true,						// https에서만 세션 생성하도록
};
module.exports = options;

app.use(session(options));

var passport = require('./lib/passport')(app);



// 미들웨어 작성. 모든 GET 요청인 경우에만 파일목록을 가져오는 미들웨어를 작동시킨다
app.get("*", function(req, res, next) {
	fs.readdir('./data', function(err, fileList) {	// fileList = [ 'CSS', 'HTML', 'JavaScript' ]
		req.list = fileList;
		next();
	});
});


// 정적 파일(jpg, html, js 등) 사용
// 마운트 경로를 지정하지 않으면 해당 폴더('public')가 '/'에 마운트된다 
app.use(express.static('public'));		// http://localhost:3000/images/hello.jpg


// 라우터 설정1: '/topic'
var topicRouter = require('./routes/topic.js');
app.use('/topic', topicRouter);

// 라우터 설정2: '/'
var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// 라우터 설정2: '/auth'
var authRouter = require('./routes/auth.js')(passport);
app.use('/auth', authRouter);



// ERROR 페이지: 404
app.use((req, res, next) => {
	res.status(404).send('<h2>404<br>Page Not Found</h2>');
	console.log('404 실행되었음');
});



// Default Error Handler: 인자 4개임. 순서에 주의!!
// 다른 미들웨어에서 next(err)을 호출했을 때 여기에서 처리함
app.use( (err, req, res, next) => {
	console.error(err.stack);
	res.status(400).send('<h2>400<br>Bad Request</h2>');		// Error: ENOENT: no such file or directory, open './data/CSS1'
});



// 서버 시작
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
