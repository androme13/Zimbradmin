/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.modules.zmsettings.ZMSettings', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.zmsettings.stores.ZMUsers',
        'Ext.data.TreeStore',
        'Ext.layout.container.Accordion',
        'Ext.toolbar.Spacer',
        'Ext.tree.Panel'
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
            shortcutCls: this.id + '-shortcut',
        };
    },
    createWindow: function (refer) {
        var me=this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            //tab zmusers
            //var refer=refer;
            var ZMUsersGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.ZMUsers');
            cfg = {
                store: ZMUsersGridStore,
                rowEditing: true,
                title: 'Uilisateurs',
                multiSelect: true,
            };
            var ZMUsersGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', cfg);
            //var ZMUsersGrid = Ext.create('MyDesktop.modules.zmsettings.views.UsersGrid', {store: ZMUsersGridStore});


            //tab ZMmodules
            var ZMModulesGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.ZMModules');
            cfg = {
                store: ZMModulesGridStore,
                rowEditing: true,
                title: 'Modules',
                multiSelect: false,
            };
            var ZMModulesGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', cfg);
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
                /*tools: [{
                        type: 'pin',
                        tooltip: 'creer un raccrouci du module sur le bureau',
                        handler: function (event, toolEl, panel) {
                            // refresh logic
                            //var item=new object();
                            var item= {name:me.launcher.text,  module:me.id,  iconCls:me.launcher.shortcutCls};
                            //console.log (me,me.launcher);
                            refer.addShortcut(item);                            
                            //console.log(MyDesktop.App());
                        }
                    }],*/
                //tools:[],
                items: {
                    xtype: 'tabpanel',
                    listeners: {
                        afterrender: function () {
                            ZMUsersGridStore.load();
                        },
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            if (newTab.store)
                            {
                                if (newTab.store.getCount() == 0)
                                    newTab.store.load();
                            }
                            //console.log(newTab);
                            //tabPanel.setSize(200, 400);
                        },
                        activate: function (tab, eOpts) {
                            console.log(tab);
                        },
                        entryAdd: function (grid) {
                            this.up().entryAdd(grid);
                        },
                        entryRemove: function (grid) {
                            // console.log(this.up());
                            this.up().entryRemove(grid);
                        }
                    },
                    //tabPosition:'left',
                    items: [{
                            xtype: ZMUsersGrid,
                        }, {
                            xtype: ZMModulesGrid,
                        },
                    ]},
                //fonctions

                entryAdd: function (grid) {
                    console.log(grid);
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
