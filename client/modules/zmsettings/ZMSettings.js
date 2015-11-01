/* 
 * ZMSettings module
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.ZMSettings', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.zmsettings.views.NewUser',
        'MyDesktop.modules.zmsettings.stores.ZMUsers',
        'MyDesktop.modules.common.gridStoreOn',
        'MyDesktop.modules.common.proxyOn',
        'Ext.toolbar.Spacer'
    ],
    id: 'zmsettings-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/zmsettings/rsc/style.css');
        this.launcher = {
            menu: 'Settings',
            text: 'Parametres de Zimbradmin',
            title: 'Gestion des Parametres ZimbrAdmin',
            iconCls: this.id + '-icon',
            shortcutCls: this.id + '-shortcut'
        };
    },
    createWindow: function () {
        var me = this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            //tab zmusers
            // création et configuration du store 
            var ZMUsersGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.ZMUsers');
            // utilisation des routines génériques pour les listeners
            var gridStoreOn = Ext.create('MyDesktop.modules.common.gridStoreOn');
            var proxyOn = Ext.create('MyDesktop.modules.common.proxyOn');
            ZMUsersGridStore.on(gridStoreOn.create());
            ZMUsersGridStore.proxy.on(proxyOn.create(ZMUsersGridStore));
            var createUserPanelOBJ = Ext.create('MyDesktop.modules.zmsettings.views.NewUser');
            // on defini le wizard d'ajout/edition de l'user
            createUserPanel=createUserPanelOBJ.create(ZMUsersGrid);
            // création et configuration du grid
            var ZMUsersGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
                store: ZMUsersGridStore,
                multiSelect: true,
                customAddRow: function (grid) {
                    var record = Ext.create(grid.store.model.modelName);
                    ZMUsersGrid.getStore().insert(0, record);
                    var form=this.up('tabpanel').down('panel[name=userWizard]').down('form');
                    form.mode = 'add';
                    form.loadRecord(ZMUsersGrid.getStore().getAt(0));       
                    this.up('panel').getLayout().setActiveItem(1);
                },
                customEditRow: function (grid,record) {                   
                    var panel=this.up('tabpanel').down('panel[name=userWizard]');
                    var form=this.up('tabpanel').down('panel[name=userWizard]').down('form');
                    panel.mode = 'edit';
                    console.log('record',record);
                    // on genere un mot de passe aléatoire entre 10000 et 99999
                    var randomPassword=(Math.floor(Math.random() * (10000 - 99999)) + 10000);
                    panel.origPassword=randomPassword.toString();
                    //console.log('origpanel',panel.origPassword);
                    form.loadRecord(record);
                    form.getForm().findField('password').setValue(randomPassword.toString());
                    form.getForm().findField('password2').setValue(randomPassword.toString());
                    this.up('panel').getLayout().setActiveItem(1);
                }
            });


            //tab ZMmodules
            // création et configuration du store 
            var ZMModulesGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.ZMModules');
            // utilisation des routines génériques pour les listeners
            var gridStoreOn = Ext.create('MyDesktop.modules.common.gridStoreOn');
            var proxyOn = Ext.create('MyDesktop.modules.common.proxyOn');
            ZMModulesGridStore.on(gridStoreOn.create());
            ZMModulesGridStore.proxy.on(proxyOn.create(ZMModulesGridStore));

            var ZMModulesGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
                store: ZMModulesGridStore,
                rowEditing: true,
                title: 'Modules',
                multiSelect: true
            });
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
                    // layout: 'border',
                    autoScroll: true,
                    listeners: {
                        afterrender: function () {
                            ZMUsersGridStore.load();
                        },
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            if (newTab.store)
                            {
                                if (newTab.store.getCount() === 0)
                                    newTab.store.load();
                            }
                            console.log(newTab);
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
                            layout: {
                                type: 'card',
                                //  align: 'stretch'
                            },
                            cardSwitchAnimation: 'slide',
                            //autoScroll: true,
                            activeItem: 0,
                            title: 'Uilisateurs',
                            defaults: {scrollable: true},
                            items: [ZMUsersGrid, createUserPanel],
                            //xtype: ZMUsersGrid,
                        },
                        {
                            xtype: ZMModulesGrid,
                        },
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
