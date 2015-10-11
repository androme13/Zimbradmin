/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var MySQLConfig = global.MySQLConfig;
var log = global.log.child({widget_type: 'DXSmtp'});
var pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false
});

var DXSmtp = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    // operations sur les user ////////////////////////////////
    addusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            console.log(params);
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM users "

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: false,
                        message: "addusers",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    destroyusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            console.log(params);
            var query = "SELECT id,level,state,username,firstname,lastname,created_date,created_by,modified_date,modified_by FROM users "

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }
                    callback({
                        success: false,
                        message: "getuserslist",
                        data: data
                    });
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    get: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            var query = "SELECT * FROM transport LIMIT " + params.start + ',' + params.limit;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                        // on cherche maintenant le nombre total
                        // d'entrées pour le paging
                        var query = "SELECT COUNT(*) AS totalCount FROM transport";
                        connection.query(query, function (err, rows, fields) {
                            connection.release();
                            //console.log(fields);
                            if (!err) {
                                //console.log('totalcount', rows[0].totalCount);
                            }
                            callback({
                                success: success,
                                totalCount: rows[0].totalCount,
                                message: "getsmtp",
                                data: data
                            });
                        })










                    }
                }
            });

            connection.on('error', function (err) {
                //res.json({"code" : 100, "status" : "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            });
        });
    },
    updateusers: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            console.log(params);
            //log.infos(params);
        });
    },
};





module.exports = DXSmtp;