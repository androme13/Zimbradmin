/* 
 * DXCommon
 * (C) Androme 2015
 * 
 */

// tools.js
// ========
module.exports = {
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
                        query = "SELECT COUNT(*) AS totalCount FROM "+params.table+" " + params.extraQuery;
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
        console.log(params[0].query);
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 402;
                DXCommon.sendError(err, callback);
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
                        //console.log('erreur', err);
                        sendError(err, callback, params[0].log);
                    }
                });
            }
            if (connection)
                connection.release();
        });
    }
};

function sendError(err, callback, log) {
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
    