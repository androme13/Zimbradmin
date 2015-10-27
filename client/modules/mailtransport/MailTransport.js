/* 
 * MailTransport module
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.mailtransport.MailTransport', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.mailtransport.stores.MailTransport',
        'Ext.toolbar.Spacer',
    ],
    id: 'mailtransport-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/mailtransport/rsc/style.css');
        this.launcher = {
            menu: 'Smtp',
            text: 'Transport des emails',
            title: 'Gestion du transport des emails',
            iconCls: this.id + '-icon',
            shortcutCls: this.id + '-shortcut',
        };
    },
    createWindow: function (refer) {
        var me = this;
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            // création et configuration du store
            var gridStore = Ext.create('MyDesktop.modules.mailtransport.stores.MailTransport');
            gridStore.on({
                refresh: function (store, eOpts) {
                    message = store.proxy.reader.jsonData;
                    // on gère les messages de retour
                    // se reporter à DOC/ZMErrorCodes
                    switch (message.error.ZMErrorCode.toString()[0]) {
                        case '1':
                            console.log('add');
                            switch (message.error.ZMErrorCode.toString()[2]) {
                                case'0':
                                    Ext.infoMsg.msg("Ajout d'éléments", "L'entrée a bien été ajoutée");
                                    break;
                            }
                            break;
                        case '2':
                            console.log('destroy');
                            var nbItems = message.data.affectedRows;
                            console.log('store', store, nbItems);
                            var txtItems = "<BR><B>" + nbItems + "</B> élément(s) supprimé(s)";
                            switch (message.error.ZMErrorCode.toString()[2]) {
                                case'0':
                                    Ext.infoMsg.msg("Suppression d'éléments", "La suppression a bien été effectuée" + txtItems);
                                    break;
                                case'3':
                                    Ext.infoMsg.msg("Suppression d'éléments", "Aucune entrée n'a été supprimée", 5000, 'red');
                                    store.reload();
                                    break;
                                case'4':
                                    Ext.infoMsg.msg("Suppression d'éléments", "Certaines entrées n'ont pas été supprimées" + txtItems, 5000, 'orange');
                                    store.reload();
                                    break;
                            }
                            break;
                        case '3':
                            console.log('read');
                            break;
                        case '4':
                            console.log('update');
                            switch (message.error.ZMErrorCode.toString()[2]) {
                                case'0':
                                    Ext.infoMsg.msg("Modification d'éléments", "La modification a bien été effectuée");
                                    break;
                            }
                            break;
                    }
                },
                scope: this
            });
            gridStore.proxy.on({
                exception: function (proxy, response, operation) {
                    var error = operation.error;
                    var title = error.code;
                    title += ' (' + error.errno + ') - ';
                    title += error.sqlState;
                    var message = error.ZMErrorMsg;
                    Ext.infoMsg.msg(title, message, 5000, 'red');
                    if (operation.action != 'read')
                    {
                        Ext.data.StoreManager.get('mailtransport').reload();
                    }
                },
                scope: this
            });
            // création et configuration du grid
            cfg = {
                store: gridStore,
                rowEditing: true,
                title: 'transport de mails',
                multiSelect: true,
            };
            var grid = Ext.create('MyDesktop.modules.common.views.PagingGrid', cfg);

            win = desktop.createWindow({
                id: this.id,
                title: this.launcher.title,
                width: 500,
                height: 400,
                iconCls: this.launcher.iconCls,
                bodyBorder: Ext.themeName !== 'neptune',
                layout: 'fit',
                items: {
                    xtype: 'tabpanel',
                    listeners: {
                        afterrender: function () {
                            gridStore.load();
                        },
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            if (newTab.store)
                            {
                                if (newTab.store.getCount() == 0)
                                    newTab.store.load();
                            }
                            console.log(newTab);
                            //tabPanel.setSize(200, 400);
                        },
                        activate: function (tab, eOpts) {
                            console.log(tab);
                        },
                        entryAdd: function (params) {
                            this.up().entryAdd(params);
                        },
                        entryRemove: function (grid) {
                            // console.log(this.up());
                            this.up().entryRemove(grid);
                        }
                    },
                    items: [{
                            xtype: grid,
                        }
                    ]},
                //fonctions
                entryAdd: function (params) {
                    console.log('entryadd:', params);
                },
                entryRemove: function (grid) {
                    console.log(grid.getSelectionModel().getSelection());
                },
                ////////////////////////////////
            });
        }
        win.down('tabpanel').setActiveTab(0);
        return win;
    }
});
