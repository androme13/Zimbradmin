/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *///
var fs = require('fs');
var MySQLConfig = global.MySQLConfig;
var log = global.log.child({widget_type: 'DXTransport'});
var pool = mysql.createPool({
    connectionLimit: 100,
    host: MySQLConfig.host,
    user: MySQLConfig.user,
    password: MySQLConfig.password,
    database: MySQLConfig.database,
    debug: false
});

var DXTransport = {
    // method signature has 5 parameters
    /**
     *
     * @param params object with received parameters
     * @param callback callback function to call at the end of current method
     * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
     * @param request only if "appendRequestResponseObjects" enabled
     * @param response only if "appendRequestResponseObjects" enabled
     */


    add: function (params, callback, sessionID, request, response) {
        var query;
        pool.getConnection(function (err, connection) {
            // gestion des erreurs non attendues sur event
            connection.on('error', function (err) {
                sendError(err, callback);
            });
            ////////////////////////////////////////////////
            if (err) {
                sendError(err, callback);
            }
            else
            {
                var id=request.session.userinfo.id;
                query = "INSERT INTO transport (domain, transport, created_by) VALUES ('"+params.domain+"','"+params.transport+"','"+id+"')";
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        data = rows;
                        success = true;
                        sendSuccess(rows.length, data, callback);
                    }
                    else
                    {
                        sendError(err, callback);
                    }
                });
            }
        });
    },
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        if (params.search)
            extraQuery = "WHERE domain LIKE '%" + params.search + "%'";
        pool.getConnection(function (err, connection) {
            // gestion des erreurs non attendues sur event
            connection.on('error', function (err) {
                sendError(err, callback);
            });
            ////////////////////////////////////////////////
            if (err) {
                sendError(err, callback);
            }
            else
            {
                query = "SELECT * FROM transport " + extraQuery + " LIMIT " + params.start + ',' + params.limit;
                connection.query(query, function (err, rows, fields) {
                    var total;
                    if (!err) {
                        data = rows;
                        // on cherche maintenant le nombre total
                        // d'entrées dans la table pour le paging
                        query = "SELECT COUNT(*) AS totalCount FROM transport " + extraQuery;
                        connection.query(query, function (err, rows, fields) {
                            connection.release();
                            if (!err) {
                                success = true;
                                total = rows[0].totalCount;
                                sendSuccess(rows[0].totalCount, data, callback)
                            }
                            else
                            {
                                sendError(err, callback);
                            }
                        })
                    }
                    else
                    {
                        sendError(err, callback);
                    }
                });
            }
        });
    },
    update: function (params, callback, sessionID, request, response) {
        var query;
        pool.getConnection(function (err, connection) {
            // gestion des erreurs non attendues sur event
            connection.on('error', function (err) {
                sendError(err, callback);
            });
            ////////////////////////////////////////////////
            if (err) {
                sendError(err, callback);
            }
            else
            {
                console.log(params);
                var id=request.session.userinfo.id;
                query ="UPDATE transport SET domain='"+params.domain+"', transport='"+params.transport+"', modified_by="+id+" WHERE id="+params.id;
                //query = "SELECT * FROM transport";
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        data = rows;
                        success = true;
                        sendSuccess(rows.length, data, callback);
                    }
                    else
                    {
                        sendError(err, callback);
                    }
                });
            }
        });
    },
};


function sendError(err, callback) {
    var error = {code: err.code, errno: err.errno, sqlState: err.sqlState, message: err.toString()};
    log.error(error);
    callback({
        success: false,
        totalCount: 0,
        message: error,
        data: null
    });
}

function sendSuccess(totalCount, data, callback, message) {
    var msg='';
    if (message) msg = message;
    callback({
        success: true,
        totalCount: totalCount,
        message: msg,
        data: data
    });
}

module.exports = DXTransport;