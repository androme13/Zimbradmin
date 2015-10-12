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
                query = "SELECT * FROM transport1 " + extraQuery + " LIMIT " + params.start + ',' + params.limit;
                connection.query(query, function (err, rows, fields) {
                    var total;
                    if (!err) {
                        if (rows.length !== 0) {
                            data = rows;
                            // on cherche maintenant le nombre total
                            // d'entrées dans la table pour le paging
                            query = "SELECT COUNT(*) AS totalCount FROM transport " + extraQuery;
                            connection.query(query, function (err, rows, fields) {
                                connection.release();
                                if (!err) {
                                    success = true;
                                    total = rows[0].totalCount;
                                    sendSuccess(rows[0].totalCount,data,callback)
                                }
                                else
                                {
                                    sendError(err, callback);
                                }
                            })
                        }
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

function sendSuccess(totalCount, data, callback) {
    callback({
        success: true,
        totalCount: totalCount,
        message: '',
        data: data
    });
}

module.exports = DXTransport;