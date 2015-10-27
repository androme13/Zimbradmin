/* 
 * Login
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.login.Login', {
    extend: 'Ext.ux.desktop.Module',
    id: 'login-win',
    init: function () {
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/login/rsc/style.css');
        this.launcher = {
            startmenu: false,
            text: 'Login Window',
            title: 'Authentification requise',
            iconCls: this.id + '-icon',
        };
        this.firstLaunch = true;
    },
    createWindow: function (user) {
        var me = this;
        var desktop = this.app.getDesktop();
        Ext.QuickTips.init();
        //var desktop = scope.desktop.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            win = desktop.createWindow({
                //firstLaunch: true,
                closable: false,
                constrainHeader: true,
                //header: false,
                iconCls: this.launcher.iconCls,
                id: this.id,
                layout: 'fit',
                maximizable: false,
                minimizable: false,
                modal: true,
                resizable: false,
                width: 300,
                title: me.launcher.title,
                items: [
                    {
                        xtype: 'form',
                        reference: 'form',
                        buttonAlign: 'center',
                        border: false,
                        bodyPadding: 10,
                        fieldDefaults: {
                            //labelWidth: 125,
                            //msgTarget: 'side',
                            autoFitErrors: false
                        },
                        items: [{
                                xtype: 'textfield',
                                emptyText: 'nom utilisateur',
                                name: 'username',
                                fieldLabel: 'Nom utilisateur',
                                allowBlank: false,
                                //tooltip: "Veuillez saisir votre nom d'utilisateur"                               
                            }, {
                                xtype: 'textfield',
                                emptyText: 'mot de passe',
                                name: 'password',
                                inputType: 'password',
                                fieldLabel: 'Mot de passe',
                                allowBlank: false,
                                //tooltip: "Veuillez saisir votre mot de passe"
                            },
                            {
                                xtype: 'label',
                                id: 'logincomment',
                                margin: '20 0 0 0',
                                html: "Veuillez saisir votre nom d'utilisateur ainsi que votre mot de passe",
                                style: {
                                    color: 'black' //default color
                                }
                            }
                        ],
                        buttons: [{
                                id: 'Login',
                                text: 'Login',
                                formBind: true,
                                listeners: {
                                    click: function (btn) {
                                        var win = btn.up('window');
                                        var form = win.down('form');
                                        form.setLoading("Veuillez patienter");
                                        ExtRemote.DXLogin.authenticate(form.getValues(),
                                                function (result, event) {
                                                        var target = btn.up('form').down('label');
                                                        if (result.error.ZMErrorCode === 100)
                                                        {
                                                            target.update('Identifiants corrects');
                                                            target.getEl().setStyle("color", "green");
                                                            desktop.app.fireEvent('processlogin', result);
                                                        }

                                                        if (result.error.ZMErrorCode === 103)
                                                        {
                                                            target.update('Mauvais identifiants');
                                                            form.setLoading(false);
                                                            target.getEl().setStyle("color", "red");
                                                        }
                                                }
                                        );
                                    }
                                }
                            }],
                        listeners: {
                            afterRender: function (thisForm, options) {
                                this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                                    enter: function () {
                                        //desktop.app.fireEvent('processlogin', form.getForm().getValues());
                                        var form = win.down('form');
                                        var button = form.down('button#Login');
                                        if (form.getForm().isValid())
                                        {
                                            button.fireEvent('click', button);
                                        }
                                    },
                                    scope: this
                                });
                            }
                        }
                    }
                ],
            });
        }
        var field = win.down('form').getForm().findField('username');
        if (user) {
            field.setValue(user);
            field.readOnly = true;
            field = win.down('form').getForm().findField('password');
        }
        field.focus(false, 1000);
        return win;
    },
});
