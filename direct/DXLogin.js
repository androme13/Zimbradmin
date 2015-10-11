/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var MySQLConfig = global.MySQLConfig;
var log = global.log.child({widget_type: 'DXLogin'});
var pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false
});

var DXLogin = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */
    authenticate: function (params, callback, sessionID, request, response) {
        var success = false;
        var message = 'Login unsuccessful';
        var data = new Object();

        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                //res.json({"code": 100, "status": "Error in connection database"});
                log.warn("Error connecting database ... \n\n");
                return;
            }
            connection.escape(params.username);
            connection.escape(params.password);
            //console.log('connected as id ' + connection.threadId);
            var query = "SELECT * from users WHERE username='" + params.username + "'";
            query += " AND password='" + params.password + "'";

            connection.query(query, function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length !== 0) {
                        success = true;
                        message = 'Login successful';
                        data.userinfo = rows[0];
                        request.session.userinfo = data.userinfo;
                        console.log(request.session.userinfo);
                        log.info('Login of ' + request.session.userinfo.username);
                    }

                    callback({
                        success: success,
                        message: message,
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
    getsession: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var data = new Object();
        var success = false;
        var parentcallback = callback;
        if (request.session.userinfo) {
            success = true;
            // on ne fournit que les info utilisateur et pas les autres
            // comme les infos coockies
            data.userinfo = request.session.userinfo;

        }
        callback({
            success: success,
            data: data
        });
    },
    isvalidsession: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var success = false;
        if (request.session.userinfo) {
            success = true;
        }
        callback({
            success: success,
        });
    },
    logout: function (params, callback, sessionID, request, response) {
        var data;
        response.header('My-Custom-Header ', '1234567890');
        request.session.userinfo = null;
        //request.session=null;
        delete request.session.userinfo;
        //delete request.session;
        //console.log(request.session);
        callback({
            success: true,
            message: 'logout',
            data: data
        });
    }
};

module.exports = DXLogin;