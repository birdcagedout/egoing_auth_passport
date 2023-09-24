module.exports = {
	isLogged: function(req) {
		// return req.session.isLogged;
		if(req.user) return true;
		else return false;
	},
	
	getNickname: function(req) {
		// return req.session.nickname;
		if(this.isLogged(req)) return req.user.nickname;
		else return '';
	}
};