var pool = require('./dao');
const REPORT_TABLE = 'report'; 
module.exports = {
	queryReports:function(callback){
		var sql = 'SELECT * FROM '+REPORT_TABLE+' WHERE del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryReport:function(id,callback){
		var sql = 'SELECT * FROM '+REPORT_TABLE+' WHERE id = ? ORDER BY id DESC LIMIT 1';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	deleteReport:function(id,callback){
		var sql = 'UPDATE '+REPORT_TABLE+' SET del = 1 WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	upReportState:function(id,state,callback){
		var sql = 'UPDATE '+REPORT_TABLE+' SET state = ? WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [state,id], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
}