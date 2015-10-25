/* 
 * DXCommon
 * (C) Androme 2015
 * 
 */

// tools.js
// ========
module.exports = {
    sendError: function (err, callback) {
        log.error(err);
        callback({
            success: false,
            error: err,
        });
    },
    sendSuccess: function (totalCount, data, callback, message) {
        var msg = '';
        if (message)
            msg = message;
        callback({
            success: true,
            totalCount: totalCount,
            error: msg,
            data: data
        });
    },
    setLanguage: function (connection, request)
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
};

var zemba = function () {
}
