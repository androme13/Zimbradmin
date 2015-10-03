/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */


Ext.infoMsg = function(){
    var msgCt;

    function createBox(t, s, c){
       // return ['<div class="msg">',
       //         '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
       //         '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
       //         '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
       //         '</div>'].join('');
       return '<div class="msg"><h3><font color="'+ c +'">&#9632;</font><CENTER><U>' + t + '</U></CENTER></h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format, color){
            if (!color)color="blue";
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s, color), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        },

        init : function(){
            if(!msgCt){
                // It's better to create the msg-div here in order to avoid re-layouts 
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
        }
    };
}();











// fix hide submenu (in chrome 43)
Ext.override(Ext.menu.Menu, {
    onMouseLeave: function (e) {
        var me = this;


        // BEGIN FIX
        var visibleSubmenu = false;
        me.items.each(function (item) {
            if (item.menu && item.menu.isVisible()) {
                visibleSubmenu = true;
            }
        })
        if (visibleSubmenu) {
            //console.log('apply fix hide submenu');
            return;
        }
        // END FIX


        me.deactivateActiveItem();


        if (me.disabled) {
            return;
        }


        me.fireEvent('mouseleave', me, e);
    }
});



Ext.define('Ext.ux.desktop.App', {
    mixins: {
        observable: 'Ext.util.Observable'
    },
    requires: [
        'Ext.container.Viewport',
        'Ext.ux.desktop.Desktop'
    ],
    isReady: false,
    modules: null,
    useQuickTips: true,
    constructor: function (config) {
        var me = this;
        // on defini les exceptions des appels DIRECT
        Ext.Direct.on("exception", function (event) {
            if (event.xhr.status === 401)
            {
                me.onLogin(me.session.userinfo.username);
            }
        });
        // on defini la tache du polling de session
        me.task = {
            run: function () {
                ExtRemote.DXLogin.isvalidsession({'action': 'isvalidsession'},
                function (result, event) {
                    //si la session existe cote serveur
                    if (result.success === false)
                    {
                        //me.stopSessionPollTask();
                        me.onLogin(me.session.userinfo.username);
                    }
                });
            },
            interval: 30000 // toutes les 30 secondes
        };
        me.addEvents(
                'ready',
                'beforeunload'
                );
        me.mixins.observable.constructor.call(this, config);

        if (Ext.isReady) {
            Ext.Function.defer(me.init, 10, me);
        } else {
            Ext.onReady(me.init, me);
        }
    },
    listeners: {
        processlogin: function (obj) {
            var me = this;
            ExtRemote.DXLogin.getsession({'action': 'getsession'},
            function (resultgetsession, event) {
                //si la session existe cote serveur
                if (resultgetsession.success === true)
                {
                    // on recupere les modules auxquels l'user à le droit
                    ExtRemote.DXUser.getmodules({'id': resultgetsession.data.userinfo.id},
                    function (resultgetmodules, event2) {
                        if (resultgetmodules.success === true) {
                            resultgetsession.data.modules = resultgetmodules.data;
                            // on configure la session
                            me.sessionConfig(resultgetsession.data);
                            // si c'est la premiere fois que 
                            // la fenetre de login est lancée
                            // c'est que l'utilisateur vient
                            // de lancer l'application
                            // on garde une instance vers login-win pour la suite
                            var backlogin = me.getModule('login-win');
                            if (me.getModule('login-win').firstLaunch === true) {
                                me.getModule('login-win').firstLaunch = false;
                                me.modules = me.loadModules();
                                // on injecte le login deja existant dans les modules
                                me.modules.push(backlogin);
                                me.initModules(me.modules);
                                me.finishmenubar();
                                me.finishtaskbar();
                                me.loginwindow.close();
                                me.desktop.taskbar.show();
                                me.loadShortcuts();
                                me.restoreShortcuts();
                            }
                            else
                                    //sinon c'est que la session arrive à sa fin et qu'il faut la renouveller
                                    {
                                        me.loginwindow.close();
                                        me.desktop.taskbar.show();
                                        me.restoreWindows();
                                        me.restoreShortcuts();
                                    }
                            ;
                            me.runSessionPollTask();

                        }
                    });
                } else
                {
                    console.log('error processlogin');
                }
                // you can grab useful info from event
            }
            );
        }
    },
    init: function () {
        var me = this, desktopCfg;
        Ext.infoMsg.init();
        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }
        // on demande au serveur si la session existe
        ExtRemote.DXLogin.getsession({'action': 'getsession'},
        function (resultgetsession, event) {
            // si une session existe c'est que l'user
            // a juste raffraichi son navigateur donc on
            // reconstruit le desktop sans demande de login
            if (resultgetsession.success === true)
            {
                // on recupere les modules auxquels l'user à le droit
                ExtRemote.DXUser.getmodules({'id': resultgetsession.data.userinfo.id},
                function (resultgetmodules, event2) {
                    if (resultgetmodules.success === true) {
                        resultgetsession.data.modules = resultgetmodules.data;
                        // puisque c'est un raffraichissement
                        // il faut ajouter le module win-login
                        // à la main sinon il n'est pas chargé.
                        // on donne la valeur true au parametre 
                        // de preparedesktop pour lui
                        // indiquer de l'ajouter.
                        me.sessionConfig(resultgetsession.data);
                        me.preparedesktop(true);
                        me.getModule('login-win').firstLaunch = false;
                        me.finishmenubar();
                        me.finishtaskbar();
                        me.loadShortcuts();
                        // on lance le polltask à la main puisque l'on ne passe pas par le login
                        me.runSessionPollTask();
                        Ext.infoMsg.msg("Bienvenue",me.session.userinfo.firstname+' '+me.session.userinfo.lastname);
                    }
                });
                // puisque c'est un raffraichissement
                // il faut ajouter le module win-login
                // à la main sinon il n'est pas chargé.
                // on donne la valeur true au parametre 
                // de preparedesktop pour lui
                // indiquer de l'ajouter.
                /*me.sessionConfig(result.data);
                 me.preparedesktop(true);
                 me.getModule('login-win').firstLaunch = false;
                 me.finishmenubar();
                 me.finishtaskbar();
                 me.loadShortcuts();
                 // on lance le polltask à la main puisque l'on ne passe pas par le login
                 me.runSessionPollTask();*/
            } else
                    // sinon c'est un premier login
                    {
                        me.preparedesktop();
                        me.onLogin();
                    }
        });
    },
    runSessionPollTask: function () {
        console.log('runpolltask', this);
        Ext.TaskManager.start(this.task);
    },
    stopSessionPollTask: function () {
        console.log('stoppolltask', this);
        Ext.TaskManager.stop(this.task);
    },
    isExistSession: function () {
        if (this.session)
            return this.session;
        else
            return false;
    },
    onLogin: function (user) {
        this.stopSessionPollTask();
        // on cache les elements
        this.hideShortcuts();
        this.hideWindows();
        this.loginwindow = this.getModule('login-win').createWindow(user);
        this.desktop.taskbar.hide();
        this.loginwindow.center();
        this.loginwindow.show();
    },
    hideShortcuts: function () {
        this.desktop.shortcutsView.hide();
    },
    restoreShortcuts: function () {
        this.desktop.shortcutsView.show();
    },
    hideWindows: function () {
        Ext.WindowMgr.each(
                function (win) {
                    if (win.minimized === false)
                    {
                        win.toRestore = true;
                        win.hide();
                    }
                }
        );
    },
    restoreWindows: function () {
        Ext.WindowMgr.each(
                function (win) {
                    if (win.toRestore === true && win.isVisible() === false)
                    {
                        win.toRestore = false;
                        win.show();
                    }
                }
        );
    },
    showModule: function (name) {
        var me = this;
        var module = this.getModule(name).createWindow(this);
        // correction d'un bug dans ext js 4.2


        // on customize les fenetres
        if (!module.tools) {
            module.tools = [];
            // si le raccourci n'existe pas on donne la possibilité d'en faire un
            module.addTool({
                type: 'pin',
                tooltip: 'Ajouter un raccourci sur le bureau',
                handler: function () {
                    var props = me.getModule(name);
                    var item = {name: props.launcher.text, module: props.id, iconCls: props.launcher.shortcutCls};
                    me.addShortcut([item]);
                }
            });
        }


        module.show();
    },
    /**
     * This method returns the configuration object for the Desktop object. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    preparedesktop: function (login) {
        var me = this, desktopCfg;
        me.modules = me.loadModules();
        if (login) {
            me.modules.push(new MyDesktop.modules.login.Login());
        };
        me.initModules(me.modules);
        desktopCfg = me.getDesktopConfig();
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);
        me.viewport = new Ext.container.Viewport({
            layout: 'fit',
            items: [me.desktop]
        });
        Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);
        me.isReady = true;
        me.fireEvent('ready', me);
    },
    loadShortcuts: function () {
        var me = this;
        ExtRemote.DXUser.getshortcuts({'action': 'getshortcuts'},
        function (result, event) {
            if (result.success === true)
            {
                Ext.each(result.data, function (record) {
                    // on genere les icones par record
                    record.iconCls = record.module + '-shortcut';
                });
                record = result.data;
                me.addShortcut(record);
            }
        }
        );
    },
    searchShortcut: function (module) {
        var store = Ext.data.StoreManager.lookup('shortcutsStore');
        var result = store.findRecord('module', module);
        return result;
    },
    removeShortcut: function (module) {
        var store = Ext.data.StoreManager.lookup('shortcutsStore');
        var result = store.findRecord('module', module);
        store.remove(result);
    },
    addShortcut: function (record) {
        var store = Ext.data.StoreManager.lookup('shortcutsStore');

        // on verifie si le raccourci n'existe pas deja
        record.forEach(function (entry) {
            var result = store.findRecord('module', entry.module);
            if (!result) {
            store.add(entry);
            }
        });
    },
    getDesktopConfig: function () {
        var me = this, cfg = {
            app: me,
            taskbarConfig: {
                app: me,
                menu: [],
                trayItems: [
                    {xtype: 'trayclock', flex: 1}
                ]}
            //taskbarConfig: me.getTaskbarConfig()
        };

        Ext.apply(cfg, me.desktopConfig);
        return cfg;
    },
    loadModules: Ext.emptyFn,
    /**
     * This method returns the configuration object for the Start Button. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getStartConfig: function () {
        var me = this,
                cfg = {
                    app: me,
                    menu: []
                }, launcher;
        Ext.apply(cfg, me.startConfig);
        Ext.each(me.modules, function (module) {
            launcher = module.launcher;
            if (launcher) {
                launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
                cfg.menu.push(module.launcher);
            }
        });
        return cfg;
    },
    /*createWindow: function (module) {
     console.log("create");
     var window = module.createWindow();
     window.show();
     },*/
    /**
     * This method returns the configuration object for the TaskBar. A derived class
     * can override this method, call the base version to build the config and then
     * modify the returned object before returning it.
     */
    /*finishstartmenu: function () {
     Ext.each(me.modules, function (module) {
     launcher = module.launcher;
     if (launcher) {
     launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
     }
     });
     },*/
    finishmenubar: function () {
        var bypass = false;
        var me = this;
        var menu = [];
        Ext.each(this.modules, function (module) {
            myModule = me.getModule(module.id);
            if (myModule.launcher) {
                if (myModule.launcher.startmenu !== false) {
                    var itemtocreate = {
                        text: myModule.launcher.text,
                        iconCls: myModule.launcher.iconCls,
                        handler: function () {
                            me.showModule(module.id);
                        },
                        scope: me,
                    };
                    if (myModule.launcher.menu) {
                        var item = {
                            text: myModule.launcher.menu,
                            iconCls: myModule.launcher.iconCls,
                            menu: {
                                items: [itemtocreate]
                            }
                        };
                    } else
                    {
                        var item = itemtocreate;
                    }
                    bypass = false;
                    // on verifie si le menu existe deja.
                    if (item.menu) {
                        Ext.each(menu, function (menuItem) {
                            if (menuItem.menu && item.menu && menuItem.text === item.text)
                            {
                                menuItem.menu.items.push(item.menu.items[0]);
                                bypass = true;
                                return false;
                            }
                        });
                    }
                    if (bypass === false)
                    {
                        menu.push(item);
                    }

                }
            }
        });
        me.desktop.taskbar.startMenu.addMenuItem(menu);
    },
    finishtaskbar: function () {
        //var me = this;
        //console.log('finishtaskbar', this.session);
        var title = this.session.userinfo.firstname + " " + this.session.userinfo.lastname + " (" + this.session.userinfo.username + ")";
        this.desktop.taskbar.startMenu.setTitle(title);
        this.desktop.taskbar.startMenu.height = 300;
        this.desktop.taskbar.startMenu.addToolItem([
            {
                text: 'Mon Compte',
                iconCls: 'settings16',
                //handler: this.onSettings,
                handler: function () {
                    this.showModule('settings-win')
                },
                scope: this
            },
            '-',
            {
                text: 'test kill session',
                iconCls: 'user',
                handler: this.onKillSession,
                scope: this
            },
            {
                text: 'test direct',
                iconCls: 'user',
                handler: this.onTestDirectSession,
                scope: this
            },
            '-',
            {
                text: 'Se deconnecter',
                iconCls: 'logout',
                handler: this.onLogout,
                scope: this
            },
        ]);

    },
    initModules: function (modules) {
        var me = this;
        Ext.each(modules, function (module) {
            module.app = me;
        });
    },
    getModule: function (name) {
        var ms = this.modules;
        for (var i = 0, len = ms.length; i < len; i++) {
            var m = ms[i];
            if (m.id == name || m.appType == name) {
                return m;
            }
        }
        return null;
    },
    getSession: function () {
        if (this.session)
            return this.session;
        else
            return false;
    }
    ,
    sessionConfig: function (obj) {
        this.session = new Object();
        this.session.userinfo = obj.userinfo;
        this.session.modules = obj.modules;
    },
    onReady: function (fn, scope) {
        if (this.isReady) {
            fn.call(scope, this);
        } else {
            this.on({
                ready: fn,
                scope: scope,
                single: true
            });
        }
    },
    getDesktop: function () {
        return this.desktop;
    },
    onUnload: function (e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});