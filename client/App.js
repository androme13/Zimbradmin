/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',
    requires: [
        //'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        'Ext.direct.*',
        'MyDesktop.modules.directapi.DirectAPI',
        'MyDesktop.modules.login.Login'
        //'MyDesktop.modules.systemstatus.SystemStatus',
        //'MyDesktop.modules.videowindow.VideoWindow',
        //'MyDesktop.modules.gridwindow.GridWindow',
        //'MyDesktop.modules.tabwindow.TabWindow',
        //'MyDesktop.modules.accordionwindow.AccordionWindow',
        //'MyDesktop.modules.notepad.Notepad',
        //'MyDesktop.modules.bogusmodule.BogusModule',
        //'MyDesktop.modules.bogusmenumodule.BogusMenuModule',
        
//        'MyDesktop.Blockalanche',
        //'MyDesktop.modules.settings.Settings'
    ],

    init: function () {
        // custom logic before getXYZ methods get called...
        console.log('init ZimbradminApp');
        //Ext.tip.QuickTipManager.init();
        this.callParent();

        // now ready...
    },
    loadModules: function () {
        var obj = new Array();
        if (this.session)
        {
            // si la session existe on insere les modules autorisés
            Ext.each(this.session.modules,function(module){
                // on effectue un require pour extjs
                // a modifier afin que ca soit asynchrone
                Ext.syncRequire(module.module);       
                // on genere le css des modules
                var cssFileSplit=module.module.split('.');
                var cssFile=cssFileSplit[1]+'/'+cssFileSplit[2]+'/rsc/style.css'
                var idCSS = obj.length+1000;
                Ext.util.CSS.createStyleSheet('', idCSS);
                Ext.util.CSS.swapStyleSheet(idCSS, cssFile);
                // on genere le module
                obj.push (eval("new "+ module.module));
            });
        }
        else
        {
            // sinon on pousse que le module login
            obj.push(new MyDesktop.modules.login.Login()); // fenetre login
        }
        return obj;
    },
    getDesktopConfig: function () {
        var me = this, ret = me.callParent();
        var obj = new Object();
        obj.contextMenuItems = [
            {text: 'Change Settings', handler: me.onSettings, scope: me}
        ];
        //me.getShortcuts(obj);
        obj.shortcuts = Ext.create('Ext.data.Store', {
            storeId: 'shortcutsStore',
            model: 'Ext.ux.desktop.ShortcutModel',
        });
        obj.wallpaper = 'wallpapers/desk.jpg';
        obj.wallpaperStretch = true;
        return Ext.apply(ret, obj);
    },
    // config for the start menu
    getStartConfig: function () {
        var me = this, ret = me.callParent();
        var obj = new Object();
        //on renvoit un objet vide car pas encore de login
        return Ext.apply(ret, obj);
    },
    /*getTaskbarConfig: function () {
     var ret = this.callParent();
     
     return Ext.apply(ret, {
     /* quickStart: [
     {name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win'},
     {name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win'}
     ],
     trayItems: [
     {xtype: 'trayclock', flex: 1}
     ]
     });
     },*/
    onLogout: function () {
        var me = this;
        Ext.Msg.confirm('Deconnection', 'Etes vous sur de vouloir vous deconnecter ?',
                function (btn) {
                    if (btn === 'yes') {
                        ExtRemote.DXLogin.logout({'logout': 'ok'},
                        function (result, event) {
                            if (result.success === true)
                            {
                                this.session = null;
                                Ext.getBody().mask('Veuillez patienter ...');
                                window.location.reload();
                            }
                        });
                    }
                }
        );
    },
    onKillSession: function () {
        ExtRemote.DXLogin.logout({'logout': 'ok'},
        function (result, event) {}
        );
    },
    onTestDirectSession: function () {
        console.log("test direct");
        ExtRemote.DXUser.getusers(null,
        function (result, event) {
        }
        );
    },
    /*onSettings: function () {
        /*var dlg = new MyDesktop.modules.settings.Settings({
         desktop: this.desktop
         });
         dlg.show();
        this.showModule('settings-win');
    }*/
});
