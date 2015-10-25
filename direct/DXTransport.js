/* 
 * DXTransport
 * (C) Androme 2015
 * 
 */
var log = global.log.child({widget_type: 'DXTransport'});
var pool = global.pool;
var DXCommon = require('../tools/DXCommon.js');
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
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 102;
                err.ZMErrorMsg = String(err);
                DXCommon.sendError(err, callback);
            }
            else
            {
                DXCommon.setLanguage(connection, request);
                var myId = request.session.userinfo.id;
                DXCommon.setLanguage(connection, request);
                query = "INSERT INTO transport (domain, transport, created_by) VALUES ('" + params[0].domain.toLowerCase() + "','" + params[0].transport.toLowerCase() + "','" + myId + "')";
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        var message = {
                            'ZMTypeCode': 'DX',
                            'ZMErrorCode': 100
                        }
                        DXCommon.sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 102;
                        err.ZMErrorMsg = String(err);
                        DXCommon.sendError(err, callback);
                    }
                });
            }
            if (connection)
                connection.release();
        });

    },
    destroy: function (params, callback, sessionID, request, response) {
        var query;
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 202;
                err.ZMErrorMsg = String(err);
                DXCommon.sendError(err, callback);
            }
            else
            {
                DXCommon.setLanguage(connection, request);
                var id = request.session.userinfo.id;
                var occur = '';
                var temp = '';
                var count = 0;
                params.forEach(function (entry) {
                    count++;
                    // test erreur///
                    //if (count == 2)
                    // entry.domain = 'aa' + entry.domain;
                    temp = "(" + entry.id + ",'" + entry.domain + "','" + entry.transport + "')";
                    if (count < params.length)
                    {
                        temp += ',';
                    }
                    occur += temp;
                });
                query = "DELETE FROM transport WHERE (id,domain,transport) IN (" + occur + ")";
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        // si toutes les entrées ont été supprimées
                        if (params.length == rows.affectedRows)
                        {
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 200
                            }
                        }
                        // si seulement certaines entrées ont ét suprimées
                        if (params.length > rows.affectedRows)
                        {
                            //console.log(err, rows);
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 204,
                            };
                        }
                        // si aucune entrée n'a été supprimée
                        if (rows.affectedRows == 0)
                        {
                            var message = {
                                ZMTypeCode: 'DX',
                                ZMErrorCode: 203,
                            };
                        }
                        DXCommon.sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 202;
                        err.ZMErrorMsg = String(err);
                        DXCommon.sendError(err, callback);
                    }
                });
            }
            if (connection)
                connection.release();
        });

    },
    get: function (params, callback, sessionID, request, response) {
        var query, extraQuery;
        // on set les parametres par défaut si ils sont absents
        if (!params)
            var params = {};
        if (!params.col)
            params.col = 'domain';
        if (!params.start)
            params.start = 0;
        if (!params.limit)
            params.limit = 50;
        if (params.search) {
            extraQuery = "WHERE " + params.col;
            extraQuery += " LIKE '%" + params.search + "%'";
        }
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 302;
                err.ZMErrorMsg = String(err)
                DXCommon.sendError(err, callback);
            }
            else
            {
                DXCommon.setLanguage(connection, request);
                query = "SELECT * FROM transport " + extraQuery + " LIMIT " + params.start + ',' + params.limit;
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        data = rows;
                        // on cherche maintenant le nombre total
                        // d'entrées dans la table pour le paging
                        query = "SELECT COUNT(*) AS totalCount FROM transport " + extraQuery;
                        connection.query(query, function (err, rows, fields) {
                            if (!err) {
                                var message = {
                                    'ZMTypeCode': 'DX',
                                    'ZMErrorCode': 300
                                };
                                DXCommon.sendSuccess(rows[0].totalCount, data, callback, message);
                            }
                            else
                            {
                                err.ZMTypeCode = 'DX';
                                err.ZMErrorCode = 302;
                                err.ZMErrorMsg = String(err)
                                DXCommon.sendError(err, callback);
                            }
                        })
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 302;
                        err.ZMErrorMsg = String(err)
                        DXCommon.sendError(err, callback);
                    }
                });
            }
            if (connection)
                connection.release();
        });
    },
    update: function (params, callback, sessionID, request, response) {
        var query;
        pool.getConnection(function (err, connection) {
            if (err) {
                err.ZMTypeCode = 'DX';
                err.ZMErrorCode = 402;
                DXCommon.sendError(err, callback);
            }
            else
            {
                DXCommon.setLanguage(connection, request);
                var myId = request.session.userinfo.id;
                query = "UPDATE transport SET domain ='" + params[0].domain.toLowerCase();
                query += "', transport='" + params[0].transport.toLowerCase();
                query += "', modified_by='" + myId;
                query += "' WHERE id='" + params[0].id + "'";
                ;
                connection.query(query, function (err, rows, fields) {
                    if (!err) {
                        var message = {
                            'ZMTypeCode': 'DX',
                            'ZMErrorCode': 400
                        }
                        DXCommon.sendSuccess(rows.length, rows, callback, message);
                    }
                    else
                    {
                        err.ZMTypeCode = 'DX';
                        err.ZMErrorCode = 402;
                        err.ZMErrorMsg = String(err);
                        //console.log('erreur', err);
                        DXCommon.sendError(err, callback);
                    }
                });
            }
            if (connection)
                connection.release();
        });
    }
};

module.exports = DXTransport;