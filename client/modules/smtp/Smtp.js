
Ext.define('MyDesktop.modules.smtp.Smtp', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.smtp.stores.SmtpServers',
        'Ext.toolbar.Spacer',
    ],
    id: 'smtp-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/smtp/rsc/style.css');
        this.launcher = {
            menu: 'Smtp',
            text: 'Gestion SMTP',
            title: 'Gestion des Serveurs SMTP',
            iconCls: this.id + '-icon',
            shortcutCls: this.id + '-shortcut',
        };
    },
    createWindow: function (refer) {
        var me = this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            var gridStore = Ext.create('MyDesktop.modules.smtp.stores.SmtpServers');
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
                        Ext.data.StoreManager.get('smtpservers').reload();
                    }
                },
                scope: this
            });
            cfg = {
                store: gridStore,
                rowEditing: true,
                title: 'Serveurs SMTP',
                multiSelect: true,
            };
            var grid = Ext.create('MyDesktop.modules.common.views.PagingGrid', cfg);

            win = desktop.createWindow({
                id: this.id,
                title: this.launcher.title,
                width: 500,
                height: 400,
                iconCls: this.launcher.iconCls,
                //animCollapse: false,
                //constrainHeader: true,
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
                    //tabPosition:'left',
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
