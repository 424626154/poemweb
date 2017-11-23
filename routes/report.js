var express = require('express');
var router = express.Router();
var reportDao = require('../dao/reportDao');
var logger = require('../utils/log4jsutil').logger(__dirname+'/report.js');
var httputil = require('../utils/httputil');

function renderInfo(user,id,res,ferr){
	reportDao.queryReport(id,function(err,result){
		console.log(err)
		console.log(result)
		if(err){
		 	res.render('report_info', { user: user,err:err,objs:null});
		}else{
			let obj ;
			if(result.length > 0 ){
				obj = result[0];
			}
			console.log(obj)
			if(ferr){
				res.render('report_info', { user: user,err:ferr,obj:obj});
			}else{
				res.render('report_info', { user: user,err:'',obj:obj});
			}
		}
	});
}

router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	reportDao.queryReports(function(err,result){
		if(err){
		 	res.render('report', { user: user,err:err,objs:[]});
		}else{
		   res.render('report', { user: user,err:'',objs:result});
		}
	});
});
// state 0 未处理 1 忽略处理 2 删除作品处理
router.get('/info', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var id = req.query.id;
	var op = req.query.op;
	if(op == 'del'){
		if(id){
			reportDao.deleteReport(id,function(err,result){
				if(err){
					renderInfo(user,id,res,err);
				}else{
					res.redirect('/report');
					
				}
			})
		}
		return 
	}
	if(op == 'ignore'){
		if(id){
			reportDao.upReportState(id,1,function(err,result){
				renderInfo(user,id,res,err);
			})
		}
		return
	}
	if(op  == 'delpoem'){
		if(id){
			reportDao.upReportState(id,2,function(err,result){
				reportDao.queryReport(id,function(err,result){
					if(err){
					 	res.render('report_info', { user: user,err:err,obj:null});
					}else{
						let obj ;
						if(result.length > 0 ){
							obj = result[0];
						}
						let body = {
					
						}
						if(obj.type == 1){
							body.id = obj.rid;
							body.userid = obj.ruserid;
							let reason = obj.report;
							if(reason){
								reason +='|'
							}
							reason += obj.custom;
							body.reason = reason;
						}
						httputil.sendPost('/admin/delpoem',body,function(err,result){
							if(err){
								res.render('report_info', { user: user,err:err,obj:obj});
							}else{
								res.render('report_info', { user: user,err:'',obj:obj});
							}
						});
					}
				});
			})
		}
		return
	}
	renderInfo(user,id,res,null);
});

module.exports = router;