//
Ext.define('MyDesktop.modules.mailtransport.stores.MailTransport', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.mailtransport.models.MailTransportModel',
    storeId: "mailtransport",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXTransport.add',
            read: 'ExtRemote.DXTransport.get',
            //update: 'ExtRemote.DXUser.updateusers',
            //destroy: 'ExtRemote.DXUser.destroyusers'
        },
        reader: {
            root: 'data',
            totalProperty: 'totalCount',
            messageProperty: 'message'
        },
    }

});