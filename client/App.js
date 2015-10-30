/* 
 * App.js
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',
    requires: [
        'Ext.ux.desktop.ShortcutModel',
        'Ext.direct.*',
        'MyDesktop.modules.core.directapi.DirectAPI',
        'MyDesktop.modules.core.login.Login'
    ],

    init: function () {
        console.log('init ZimbradminApp');
        this.callParent();
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
            obj.push(new MyDesktop.modules.core.login.Login()); // fenetre login
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
    onLogout: function () {
        var me = this;
        Ext.Msg.confirm('Deconnection', 'Etes vous sur de vouloir vous deconnecter ?',
                function (btn) {
                    if (btn === 'yes') {
                        ExtRemote.core.DXLogin.logout({'logout': 'ok'},
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
        ExtRemote.core.DXLogin.logout({'logout': 'ok'},
        function (result, event) {}
        );
    },
    onTestDirectSession: function () {
        console.log("test direct");
        ExtRemote.core.DXUser.get(null,
        function (result, event) {
        }
        );
    },
});
