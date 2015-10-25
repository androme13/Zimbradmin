/* 
 * DXLogin
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXLogin'});
var pool = global.pool;


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
                err.ZMTypeCode = 'LOGIN';
                err.ZMErrorCode = 101;
                sendError(err, callback);
            }
            else
            {
                setLanguage(connection, request);
                connection.escape(params.username);
                connection.escape(params.password);
                var query = "SELECT * from users WHERE username='" + params.username + "'";
                query += " AND password='" + params.password + "'";
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        if (rows.length !== 0) {
                            success = true;
                            message = 'Login successful';
                            data.userinfo = rows[0];
                            request.session.userinfo = data.userinfo;
                            log.info('Login of ' + request.session.userinfo.username);
                            var message = {
                                'ZMTypeCode': 'LOGIN',
                                'ZMErrorCode': 100
                            }
                            sendSuccess(rows.length, data, callback, message);

                        } else
                        {
                            var message = {
                                'ZMTypeCode': 'LOGIN',
                                'ZMErrorCode': 103
                            }
                            sendSuccess(rows.length, null, callback, message);
                        }
                    }
                    else
                    {
                        err.ZMTypeCode = 'LOGIN';
                        err.ZMErrorCode = 102;
                        err.ZMErrorMsg = String(err);
                        console.log('erreurlogin', err);
                        sendError(err, callback);
                    }
                });
            }
            if (connection)
                connection.release();
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
            var message = {
                'ZMTypeCode': 'LOGIN',
                'ZMErrorCode': 300
            }
            sendSuccess(null, data, callback, message);
        }
        else
        {
            err.ZMTypeCode = 'LOGIN';
            err.ZMErrorCode = 303;
            err.ZMErrorMsg = null;
            sendError(err, callback);
        }
    },
    isvalidsession: function (params, callback, sessionID, request, response) {
        response.header('My-Custom-Header ', '1234567890');
        var success = false;
        if (request.session.userinfo) {
            success = true;
            var message = {
                'ZMTypeCode': 'LOGIN',
                'ZMErrorCode': 300
            }
            sendSuccess(null, data, callback, message);
        }
        else
        {
            err.ZMTypeCode = 'LOGIN';
            err.ZMErrorCode = 303;
            err.ZMErrorMsg = null;
            sendError(err, callback);
        }
        /*callback({
         success: success,
         });*/
    },
    logout: function (params, callback, sessionID, request, response) {
        //var data;
        response.header('My-Custom-Header ', '1234567890');
        //request.session.userinfo = null;
        if (request.session.userinfo)
            delete request.session.userinfo;
        var message = {
            'ZMTypeCode': 'LOGIN',
            'ZMErrorCode': 102
        }
        sendSuccess(null, null, callback, message);
    }
};

function sendError(err, callback) {
    log.error(err);
    callback({
        success: false,
        error: err,
    });
}

function sendSuccess(totalCount, data, callback, message) {
    var msg = '';
    if (message)
        msg = message;
    callback({
        success: true,
        totalCount: totalCount,
        error: msg,
        data: data
    });
}
function setLanguage(connection, request)
{
    var lang = "fr_FR";
    if (request.session.userinfo) {
        if (request.session.userinfo.lang) {
            lang = request.session.userinfo.lang;
        }
    }
    var query = "SET lc_messages = '" + lang + "'";
    connection.query(query, function (err, rows, fields) {
    });
}


module.exports = DXLogin;