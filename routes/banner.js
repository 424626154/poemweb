var express = require('express');
var router = express.Router();
var bannerDao = require('../dao/bannerDao');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var logger = require('../utils/log4jsutil').logger(__dirname+'/banner.js');

router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	console.log(req.query);
	var op = req.query.op;
	console.log(op)
	if(op == 'state1'){
		var id = req.query.id;
		bannerDao.updateBanner(id,1,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/banner");
		});
		return;
	}else if(op == 'state0'){
		var id = req.query.id;
		bannerDao.updateBanner(id,0,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/banner");
		});
		return;
	}else if(op == 'del'){
		var id = req.query.id;
		bannerDao.deleteBanner(id,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/banner");
		});
		return;
	}
	bannerDao.queryBanners(function(err,result){
		if(err){
		 	res.render('banner', { user: user,err:err,objs:[]});
		}else{
		   res.render('banner', { user: user,err:'',objs:result});
		}
	});
});

router.get('/addbanner', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	res.render('addbanner', { user: user,err:null});
});
/**
 * 添加banner
 * @param  type 1 页面 2 作品 3 名家
 */
router.post('/addbanner',multipartMiddleware,function(req, res, next){
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  console.log('post addbanner');
  // res.send('sendmsg');
  console.log(req.body);
  var body = req.body;
  var title = body.title;
  var content = body.content;
  var type = body.type;
  var err = "";
  if(!title||!content||!type){
    err = "参数错误!";
    res.render('addbanner', { user: user,err:err});
  }else{
  	var btype = 0;
  	if(type == 'web'){
  		var url = body.url;
  		if(!url){
  			err = "外链地址错误!";
		    res.render('addbanner', { user: user,err:err});
  		}else{
  			btype = 1;
  			bannerDao.addBanner(title,content,btype,url,0,'',function(err,result){
  				if(err){
  					logger.error(err)
  					res.render('addbanner', { user: user,err:err});
  				}else{
  					res.redirect("/banner");
  				}
  			});
  		}
  	}else if(type == 'poem'){
  		var pid = body.pid;
  		if(!pid){
  			err = "作品id错误!";
		    res.render('addbanner', { user: user,err:err});
  		}else{
  			btype = 2;
  			bannerDao.addBanner(title,content,btype,'',pid,'',function(err,result){
  				if(err){
  					logger.error(err)
  					res.render('addbanner', { user: user,err:err});
  				}else{
  					res.redirect("/banner");
  				}
  			});
  		}
    }else if(type == 'famous'){
      var author = body.author;
      if(!author){
        err = "作者名称错误!";
        res.render('addbanner', { user: user,err:err});
      }else{
        btype = 3;
        bannerDao.addBanner(title,content,btype,'',0,author,function(err,result){
          if(err){
            logger.error(err)
            res.render('addbanner', { user: user,err:err});
          }else{
            res.redirect("/banner");
          }
        });
      }
  	}else{
  		err = '类型错误';
  		res.render('addbanner', { user: user,err:err});
  	}
  }
});
/**
 * 修改banner
 */
router.get('/upbanner', function(req, res, next) {
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  var id = req.query.id;
  if(id){
      bannerDao.queryBanner(id,function(err,result){
        if(err){
          res.render('upbanner', { user: user,err:err,obj:null});
        }else{
          if(result.length > 0){
            res.render('upbanner', { user: user,err:null,obj:result[0]});
          }else{
            res.render('upbanner', { user: user,err:'ID错误',obj:null});
          }
        }
      })
  }else{
      res.render('upbanner', { user: user,err:'参数错误',obj:null});
  }
});


router.post('/upbanner',multipartMiddleware,function(req, res, next){
  var user = req.cookies.user;
  if(!user){
    res.redirect("/login");
    return ;
  }
  console.log('post addbanner');
  // res.send('sendmsg');
  console.log(req.body);
  var body = req.body;
  var id = body.id;
  var title = body.title;
  var content = body.content;
  var type = body.type;
  var err = "";
  if(!title||!content||!type){
    err = "参数错误!";
    res.render('addbanner', { user: user,err:err});
  }else{
    var btype = 0;
    if(type == 'web'){
      var url = body.url;
      if(!url){
        err = "外链地址错误!";
        res.render('addbanner', { user: user,err:err});
      }else{
        btype = 1;
        bannerDao.upBanner(id,title,content,btype,url,0,'',function(err,result){
          if(err){
            logger.error(err)
            res.render('addbanner', { user: user,err:err});
          }else{
            res.redirect("/banner");
          }
        });
      }
    }else if(type == 'poem'){
      var pid = body.pid;
      if(!pid){
        err = "作品id错误!";
        res.render('addbanner', { user: user,err:err});
      }else{
        btype = 2;
        bannerDao.upBanner(id,title,content,btype,'',pid,'',function(err,result){
          if(err){
            logger.error(err)
            res.render('addbanner', { user: user,err:err});
          }else{
            res.redirect("/banner");
          }
        });
      }
    }else if(type == 'famous'){
      var author = body.author;
      if(!author){
        err = "名家作者名称错误!";
        res.render('addbanner', { user: user,err:err});
      }else{
        btype = 3;
        bannerDao.upBanner(id,title,content,btype,'',0,author,function(err,result){
          if(err){
            logger.error(err)
            res.render('addbanner', { user: user,err:err});
          }else{
            res.redirect("/banner");
          }
        });
      }
    }else{
      err = '类型错误';
      res.render('addbanner', { user: user,err:err});
    }
  }
});

module.exports = router;