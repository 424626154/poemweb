var express = require('express');
var router = express.Router();
var bannerDao = require('../dao/bannerDao');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var logger = require('../utils/log4jsutil').logger(__dirname+'/appweb.js');
router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	res.render('appweb', { user: user,err:''});
});
router.get('/banner', function(req, res, next) {
	res.render('appweb_banner');
});

module.exports = router;