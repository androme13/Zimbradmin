/* 
 * Desktop App.js
 * (C) Androme 2015
 * 
 */

Ext.infoMsg = function () {
    var msgCt;
    function createBox(t, s, c) {
        return '<div class="msg"><h3><font color="' + c + '">&#9632;</font><CENTER><U>' + t + '</U></CENTER></h3><p>' + s + '</p></div>';
    }
    return {
        msg: function (title, format, delay, color) {
            if (!delay || delay == 0)
                delay = 1000;
            if (!color)
                color = "blue";
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s, color), true);
            m.hide();
            m.slideIn('t').ghost("t", {delay: delay, remove: true});
        },
        init: function () {
            if (!msgCt) {
                // It's better to create the msg-div here in order to avoid re-layouts 
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
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
            console.log('exception XHR:', event);
            if (event.xhr) {
                if (event.xhr.status == 401)
                {
                    me.onLogin(me.session.userinfo.username);
                }
                else
                {
                    Ext.infoMsg.msg("Erreur Serveur", event.message);
                }
            }
        });
        // on defini la tache du polling de session
        me.task = {
            run: function () {
                ExtRemote.DXLogin.isvalidsession({'action': 'isvalidsession'},
                function (result, event) {
                    //si la session existe cote serveur
                    if (result) {
                        if (result.success === false)
                        {
                            me.onLogin(me.session.userinfo.username);
                        }
                    }
                });
            },
            interval: 60000 // toutes les 60 secondes
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
                                me.loadShortcuts(resultgetmodules.data);
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
                            Ext.infoMsg.msg("Bienvenue", me.session.userinfo.firstname + ' ' + me.session.userinfo.lastname);

                            me.runSessionPollTask();

                        }
                    });
                } else
                {
                    console.log('error processlogin');
                }
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
                        me.loadShortcuts(resultgetmodules.data);
                        // on lance le polltask à la main puisque l'on ne passe pas par le login
                        me.runSessionPollTask();
                        Ext.infoMsg.msg("Bienvenue", me.session.userinfo.firstname + ' ' + me.session.userinfo.lastname);
                    }
                });
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
                    me.registerShortcut(item);
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
        }
        ;
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
    loadShortcuts: function (modules) {
        var me = this;
        var record = [];
        var shortcutsToCreate = [];
        // on creer en premier un tableau qui contient que les modules
        // qui possèdent un raccourci
        modules.forEach(function (entry) {
            if (entry.hasshortcut) {
                shortcutsToCreate.push(entry);
            }
        });
        // ensuite on va chercher le nom du module chargé pour
        // creer le raccourci
        shortcutsToCreate.forEach(function (entry) {
            // on parcourt les modules chargés pour voir si
            // il y a correspondance dans les noms
            me.modules.forEach(function (loadedModule) {
                if (entry.module == loadedModule.$className)
                {
                    record.push({
                        module: loadedModule.id,
                        name: loadedModule.launcher.text,
                        iconCls: loadedModule.id + '-shortcut',
                    });
                }
            });

        });
        me.addShortcuts(record);
    },
    searchShortcut: function (module) {
        var store = Ext.data.StoreManager.lookup('shortcutsStore');
        var result = store.findRecord('module', module);
        return result;
    },
    removeShortcut: function (records) {
        var store = Ext.data.StoreManager.lookup('shortcutsStore');
        //var result = store.findRecord('module', module);
        shortcutsToRemove = [];
        records.forEach(function (entry) {
            var result = store.findRecord('module', entry);
            if (result) {
                shortcutsToRemove.push(result);
                console.log(result);
            }
        });
        store.remove(shortcutsToRemove);
    },
    addShortcuts: function (records) {
        var me = this;
        var store = Ext.data.StoreManager.lookup('shortcutsStore');
        shortcutsToAdd = [];
        // on verifie si le raccourci n'existe pas deja
        records.forEach(function (entry) {
            var result = store.findRecord('module', entry.module);
            if (!result) {
                shortcutsToAdd.push(entry);
            }
        });
        store.add(shortcutsToAdd);
    },
    registerShortcut: function (record) {
        // si register = false, le raccourci est supprimé sinon il est ajouté
        var me = this;
        var module;
        this.modules.forEach(function (entry) {
            if (record.module == entry.id) {
                module = entry.$className;
            }
        });
        ExtRemote.DXModules.addmodulesshortcut({'id': this.desktop.app.session.userinfo.id, 'module': module},
        function (result) {
            me.addShortcuts([record]);
        });
    },
    unregisterShortcut: function (record) {
        var me = this;
        var module;
        this.modules.forEach(function (entry) {
            if (record == entry.id) {
                module = entry.$className;
            }
        });
        console.log(module);
        ExtRemote.DXModules.removemodulesshortcut({'id': this.desktop.app.session.userinfo.id, 'module': module},
        function (result) {
            me.removeShortcut([record]);
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
        var title = this.session.userinfo.firstname + " " + this.session.userinfo.lastname + " (" + this.session.userinfo.username + ")";
        this.desktop.taskbar.startMenu.setTitle(title);
        this.desktop.taskbar.startMenu.height = 300;
        this.desktop.taskbar.startMenu.addToolItem([
            {
                text: 'Mon Compte',
                iconCls: 'settings16',
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
        //console.log ('this.session.modules',this.session.modules)
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