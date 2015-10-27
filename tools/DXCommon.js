/* 
 * DXCommon
 * (C) Androme 2015
 * 
 */

// tools.js
// ========
module.exports = {
    add: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 102;
                err.ZMErrorMsg = String(err);
                sendError(err, callback, params.log);
            }
            else
            {
                setLanguage(connection, request);
                connection.query(params.query, function (err, rows, fields) {
                    if (!err) {
                        var message = {
                            'ZMTypeCode': 'DX',
                            'ZMErrorCode': 100
                        };
                        sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 102;
                        err.ZMErrorMsg = String(err);
                        sendError(err, callback, params.log);
                    }
                });
            }
            if (connection)
                connection.release();
        });

    },
    destroy: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 202;
                err.ZMErrorMsg = String(err);
                sendError(err, callback, params.log);
            }
            else
            {
                setLanguage(connection, request);
                connection.query(params.query, function (err, rows, fields) {
                    if (!err) {
                        // si toutes les entrées ont été supprimées
                        if (params.length === rows.affectedRows)
                        {
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 200
                            };
                        }
                        // si seulement certaines entrées ont ét suprimées
                        if (params.length > rows.affectedRows)
                        {
                            //console.log(err, rows);
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 204
                            };
                        }
                        // si aucune entrée n'a été supprimée
                        if (rows.affectedRows === 0)
                        {
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 203
                            };
                        }
                        sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 202;
                        err.ZMErrorMsg = String(err);
                        sendError(err, callback, params.log);
                    }
                });
            }
            if (connection)
                connection.release();
        });

    },
    get: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 302;
                err.ZMErrorMsg = String(err)
                sendError(err, callback, params.log);
            }
            else
            {
                setLanguage(connection, request);
                connection.query(params.query, function (err, rows, fields) {
                    if (!err) {
                        data = rows;
                        // on cherche maintenant le nombre total
                        // d'entrées dans la table pour le paging
                        query = "SELECT COUNT(*) AS totalCount FROM " + params.table + " " + params.extraQuery;
                        connection.query(query, function (err, rows, fields) {
                            if (!err) {
                                var message = {
                                    'ZMTypeCode': 'DX',
                                    'ZMErrorCode': 300
                                };
                                sendSuccess(rows[0].totalCount, data, callback, message);
                            }
                            else
                            {
                                err.ZMTypeCode = 'DX';
                                err.ZMErrorCode = 302;
                                err.ZMErrorMsg = String(err)
                                sendError(err, callback, params.log);
                            }
                        })
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 302;
                        err.ZMErrorMsg = String(err)
                        sendError(err, callback, params.log);
                    }
                });
            }
            if (connection)
                connection.release();
        });
    },
    update: function (params, callback, sessionID, request, response) {
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 402;
                err.ZMErrorMsg = String(err)
                sendError(err, callback);
            }
            else
            {
                setLanguage(connection, request);
                connection.query(params[0].query, function (err, rows, fields) {
                    if (!err) {
                        var message = {
                            'ZMTypeCode': 'DX',
                            'ZMErrorCode': 400
                        }
                        sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 402;
                        err.ZMErrorMsg = String(err);
                        sendError(err, callback, params[0].log);
                    }
                });
            }
            if (connection)
                connection.release();
        });
    },
    sendMsg: function (success, msg, data, callback, totalCount, log) {
        if (log)
            log.error(err);
        if (success === true)
        {
            callback({
                success: true,
                totalCount: totalCount,
                error: msg,
                data: data
            });
        }
        else
        {
            callback({
                success: false,
                error: msg,
            });
        }
    }
};

function sendError(err, callback, log) {
    if (log)
        log.error(err);
    callback({
        success: false,
        error: err,
    });
}

function sendSuccess(totalCount, data, callback, message) {
    var msg = {};
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
    