/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fs = require('fs');
var MySQLConfig = global.MySQLConfig;
var log = global.log.child({widget_type: 'DXModules'});
var pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false
});

var DXModules = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    getmodules: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //console.log('connected as id ' + connection.threadId);
            var query = "SELECT * FROM modules "


            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }

                    callback({
                        success: success,
                        message: "getmodules",
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
    addmodulesshortcut: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //console.log('connected as id ' + connection.threadId);
            //var query = "SELECT * FROM modules ";
            //var query = 'UPDATE modules SET hasshortcut=1 WHERE id=1';

            var query = "UPDATE usersmodules " +
                    "INNER JOIN users " +
                    "ON users.id=usersmodules.userid " +
                    "INNER JOIN modules " +
                    "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                    "SET usersmodules.hasshortcut=1 " +
                    "WHERE usersmodules.userid=" + params.id;
            
            /*var query = "SELECT userid,moduleid,hasshortcut FROM usersmodules " +
                    "INNER JOIN users " +
                    "ON users.id=usersmodules.userid " +
                    "INNER JOIN modules " +
                    "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                    "WHERE usersmodules.userid=" + params.id;*/
            

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }

                    callback({
                        success: success,
                        message: "getmodules",
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
    removemodulesshortcut: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            //console.log('connected as id ' + connection.threadId);
            //var query = "SELECT * FROM modules ";
            //var query = 'UPDATE modules SET hasshortcut=1 WHERE id=1';

            var query = "UPDATE usersmodules " +
                    "INNER JOIN users " +
                    "ON users.id=usersmodules.userid " +
                    "INNER JOIN modules " +
                    "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                    "SET usersmodules.hasshortcut=0 " +
                    "WHERE usersmodules.userid=" + params.id;
            
            /*var query = "SELECT userid,moduleid,hasshortcut FROM usersmodules " +
                    "INNER JOIN users " +
                    "ON users.id=usersmodules.userid " +
                    "INNER JOIN modules " +
                    "ON (modules.id=usersmodules.moduleid AND modules.module='" + params.module + "') " +
                    "WHERE usersmodules.userid=" + params.id;*/
            

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        data = rows;
                    }

                    callback({
                        success: success,
                        message: "getmodules",
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
    }
};

module.exports = DXModules;