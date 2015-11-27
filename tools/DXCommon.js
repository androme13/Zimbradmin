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
    add2: function (query, callback, sessionID, request, response, log) {
        var result = [];
        var data = [];
        var message = {};
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 102;
                err.ZMErrorMsg = String(err);
                if (connection)
                    connection.release();
                sendError(err, callback, log);
            }
            else
            {
                setLanguage(connection, request);
                message = {
                    'ZMTypeCode': 'DX',
                    'ZMErrorCode': 100,
                };
                connection.query(query, function (err, rows, fields) {
                    if (connection)
                        connection.release();
                    if (!err) {
                        if (rows.length > 1)
                            rows.every(function (row) {
                                data.push(row);
                                return true;
                            });
                        else
                            data.push(rows);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 102;
                        err.ZMErrorMsg = String(err);
                        sendError(err, callback, log);
                    }
                    sendSuccess(data.length, data, callback, message);
                });
            }
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
    destroy2: function (query, callback, sessionID, request, response, log) {
        var result = [];
        var data = [];
        var message = {};
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 202;
                err.ZMErrorMsg = String(err);
                if (connection)
                    connection.release();
                sendError(err, callback, log);
            }
            else
            {
                setLanguage(connection, request);
                connection.query(query, function (err, rows, fields) {
                    // on encapsule query et rows dans un tableau
                    // si ils ne sont pas deja des tableaux
                    if (Array.isArray(query) === false)
                        query = [query];
                    if (Array.isArray(rows) === false)
                        rows = [rows];
                    if (connection)
                        connection.release();
                    if (!err) {
                        var globalAffectedRows = 0;
                        rows.every(function (row) {
                            globalAffectedRows += row.affectedRows;
                            data.push(row);
                            return true;
                        });
                        if (globalAffectedRows === rows.length)
                        {
                            message = {
                                'ZMTypeCode': 'DX',
                                'ZMErrorCode': 200,
                            };

                        }
                        else
                        // si seulement certaines entrées ont été suprimées
                        if (globalAffectedRows < rows.length)
                        {
                            message = {
                                'ZMTypeCode': 'DX',
                                'ZMErrorCode': 204,
                            };
                        }
                        else
                        // si aucune entrée n'a été supprimée
                        if (globalAffectedRows === 0)
                        {
                            message = {
                                'ZMTypeCode': 'DX',
                                'ZMErrorCode': 203,
                            };
                        }
                        message.affectedRows=globalAffectedRows;
                        sendSuccess(data.length, data, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 202;
                        err.ZMErrorMsg = String(err);
                        sendError(err, callback, log);
                    }

                });
            }

        });

    },
    get: function (params, callback, sessionID, request, response) {
        //params.log.info('query',params.query);
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 302;
                err.ZMErrorMsg = String(err);
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
                                //params.log.info('result',data,message);
                                sendSuccess(rows[0].totalCount, data, callback, message);
                            }
                            else
                            {
                                err.ZMTypeCode = 'DX';
                                err.ZMErrorCode = 302;
                                err.ZMErrorMsg = String(err);
                                sendError(err, callback, params.log);
                            }
                        });
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 302;
                        err.ZMErrorMsg = String(err);
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
                err.ZMErrorMsg = String(err);
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
                        };
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
            log.info(data);
        if (success === true)
        {
            callback(null, {
                success: true,
                totalCount: totalCount,
                error: msg,
                data: data
            });
        }
        else
        {
            callback(null, {
                success: false,
                error: msg
            });
        }
    }
};

function sendError(err, callback, log) {
    if (log)
        log.error(err);
    callback(null, {
        success: false,
        error: err
    });
}

function sendSuccess(totalCount, data, callback, message) {
    var msg = {};
    if (message)
        msg = message;
    callback(null, {
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
    