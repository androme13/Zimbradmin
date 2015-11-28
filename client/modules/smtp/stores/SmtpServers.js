/* 
 * SmtpServers STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.smtp.stores.SmtpServers', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.smtp.models.SmtpServerModel',
    storeId: "smtpservers",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXSmtp.add',
            read: 'ExtRemote.DXSmtp.get',
            update: 'ExtRemote.DXSmtp.update',
            destroy: 'ExtRemote.DXSmtp.destroy'
        },
        reader: {
            root: 'data',
            totalProperty: 'totalCount',
            messageProperty: 'error'
        },
        writer: {
            allowSingle: false
        }
    }
});