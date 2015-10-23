/* 
 * MailTransport STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.mailtransport.stores.MailTransport', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.mailtransport.models.MailTransportModel',
    storeId: "mailtransport",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXTransport.add',
            read: 'ExtRemote.DXTransport.get',
            update: 'ExtRemote.DXTransport.update',
            destroy: 'ExtRemote.DXTransport.destroy'
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