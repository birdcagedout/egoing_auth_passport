// express-session@1.17.3 모듈 예제
// expressjs: https://expressjs.com/en/resources/middleware/session.html



var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = express();


// 세션 설치
// - secret(필수): session ID cookie를 sign할 때 필요한 스트링, parsing 예측 불가한 랜덤한 게 제일 좋음 ==> 기본문자열 + 클라이언트 식별문자열 + 시간적 요소(매번 바뀌면 매번 새로운 세션 생성되므로 안 됨)
// - resave(옵션): session값이 변경되지 않았어도 무조건 store에 저장할지 여부. false이면 session값이 바뀌었을 때만 store에 저장한다. ==> 무조건 false 추천
// - saveUninitialized(옵션): initialize되지 않은 세션도 강제로 store에 저장할지 여부. true이면 session이 필요하기 전까지는 session을 구동하지 않는다.
app.use(session({
  // secret: 'sunw001010' + 'grpay' + new Date(),		// secret.split('grpay') ==> [ 'sunw001010', 'Thu Sep 21 2023 18:52:07 GMT+0900 (Korean Standard Time)' ]
	secret: 'sunw001010' + 'grpay',
  resave: false,
  saveUninitialized: true,
	store: new FileStore()
}));


app.get('/', function (req, res, next) {
	// console.log(req.session);
	if(req.session.num === undefined) {
		req.session.num = 1;
	} else {
		req.session.num += 1;
	}
  res.send(`Views: ${req.session.num}`);
})

app.listen(3000, function() {
	console.log(`Listening on port 3000...`);
});