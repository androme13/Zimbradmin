/* 
 * NewUser
 * (C) Androme 2015
 * 
 */
// wizard de création d'user



Ext.define('MyDesktop.modules.zmsettings.views.NewUser', {
    create: function (grid) {

        // on fabrique la validity pour les passwords
        // Ext.apply(Ext.form.field.vTypes, {});
        Ext.apply(Ext.form.field.VTypes, {
            password: function (val, field) {
                console.log('pwdverif');
                var form = field.up('form');
                var origPwd = form.getForm().findField('password').rawValue;
                if (val !== origPwd)
                    return false
                return true;
            },
            passwordText: 'Les mots de passes ne sont pas identiques'
        });


        // on fabrique le filtre de saisie
        var mask = /^[a-zA-Z0-9\-\_\.]*$/;
        // création et configuration du store 
        var origGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.ZMModules');
        var origGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
            store: origGridStore,
            name: 'src',
            rowEditing: false,
            title: 'Modules disponibles',
            readOnly: true,
            multiSelect: true,
            margins: '0 5 0 0'
        });
        var dstGridStore = Ext.create('Ext.data.Store', {
            fields: [{name: 'id', hidden: true}, {name: 'module'}, {name: 'comment', binded: false}],
            proxy: {
                type: 'memory'
            }
        });
        var dstGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
            store: dstGridStore,
            name: 'dst',
            rowEditing: false,
            title: "Modules de l'utilisateur",
            readOnly: true,
            multiSelect: true
        });
        origGrid.columns.every(function (col) {
            console.log(col);
            return true;
        });
        // on cache les toolbars de la grid de destination
        dstGrid.hideToolbar(true);
        dstGrid.hidePagingbar(true);
        origGrid.on({
            afterRender: function (grid) {
                grid.getStore().load();
            },
            itemdblclick: function (dv, record, item, index, e) {
                dstGrid = this.up().down('grid[name=dst]');
                console.log(record.data);
                if (dstGrid.store.findRecord('module', record.data.module))
                {
                    Ext.infoMsg.msg("Ajout de module à l'utilisateur",
                            "Vous avez deja ajouté le module<BR>" + record.data.module,
                            2000,
                            'orange');
                }
                else
                {
                    dstGrid.store.add(record);
                }
            }
        });
        var panel = {
            name: 'userWizard',
            title: "Création d'un nouvel utilisateur",
            itemId: 'wizard',
            autoScroll: true,
            userData: {},
            //overflowY: 'scroll',
            //height: 600,
            layout: {
                type: 'card',
                align: 'stretch',
                deferredRender: true
            },
            defaults: {
                border: false
            },
            items: [
                {
                    itemId: 'step-1',
                    xtype: 'form',
                    //layout: 'fit',
                    layout: 'anchor',
                    //anchor: '100%',
                    bodyPadding: 5,
                    //defaults: {anchor: '100%'},
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Etat et niveau du compte',
                            margins: '0 0 0 0',
                            //fieldLabel: 'Date Range',
                            combineErrors: true,
                            //msgTarget: 'side',
                            layout: 'hbox',
                            defaults: {
                                //flex: 1,
                                //hideLabel: true
                                margins: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'state',
                                    fieldLabel: 'Etat du compte',
                                    valueField: 'value',
                                    queryMode: 'local',
                                    value: 2,
                                    store: [[0, 'Inactif'], [1, 'Bloqué'], [2, 'Actif']],
                                    editable: false
                                },
                                {
                                    name: 'level',
                                    xtype: 'combo',
                                    fieldLabel: 'Type de compte',
                                    valueField: 'value',
                                    queryMode: 'local',
                                    value: 1,
                                    store: [
                                        [0, 'invité'],
                                        [1, 'utilisateur'],
                                        [2, 'super utilisateur'],
                                        [3, 'administrateur'],
                                        [4, 'super administrateur']
                                    ],
                                    editable: false
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: "Informations de l'utilisateur",
                            margins: '0 0 0 0',
                            //fieldLabel: 'Date Range',
                            combineErrors: true,
                            //msgTarget: 'side',
                            layout: 'vbox',
                            defaults: {
                                //flex: 1,
                                //hideLabel: true
                                maskRe: mask,
                                margins: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'id',
                                    hidden: true
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'username',
                                    fieldLabel: 'Nom utilisateur',
                                    maxLength: 64,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'firstname',
                                    fieldLabel: 'Prénom',
                                    maxLength: 64,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'lastname',
                                    fieldLabel: 'Nom',
                                    maxLength: 64,
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            validator: function () {
                                console.log('validator');
                                return false;
                            },
                            title: 'Mot de passe',
                            margins: '0 0 0 0',
                            //fieldLabel: 'Date Range',
                            combineErrors: true,
                            //msgTarget: 'side',
                            layout: 'vbox',
                            defaults: {
                                flex: 1,
                                //hideLabel: true
                                margins: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'password',
                                    //vtype: 'password',
                                    inputType: 'password',
                                    maxLength: 64,
                                    allowBlank: false,
                                    fieldLabel: 'Mot de passe'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'password2',
                                    vtype: 'password',
                                    inputType: 'password',
                                    maxLength: 64,
                                    allowBlank: false,
                                    fieldLabel: 'Confirmation du mot de passe',
                                }
                            ]
                        },
                    ],
                    buttons: [
                        {
                            text: 'Annuler',
                            handler: function () {
                                this.up('tabpanel').activeTab.getLayout().setActiveItem(0);
                            }
                        },
                        {
                            text: 'Suivant &raquo;',
                            handler: function () {
                                var wizard = this.up('#wizard');
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    var panel = form.up('panel');
                                    panel.userData.user = form.getForm().getValues();
                                    // on supprime le champ password2 des données
                                    delete panel.userData.user.password2;
                                    wizard.getLayout().setActiveItem('step-2');
                                }
                            }
                        }],
                    listeners: {
                        afterrender: function () {
                            console.log('render');
                        }}
                },
                {
                    itemId: 'step-2',
                    xtype: 'form',
                    layout: 'fit',
                    items: [
                        {
                            //flex: 1,
                            xtype: 'panel',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                flex: 1
                            },
                            items: [origGrid, dstGrid]
                        }
                    ],
                    buttons: [
                        {
                            text: 'Annuler',
                            handler: function () {
                                this.up('tabpanel').activeTab.getLayout().setActiveItem(0);
                            }
                        },
                        {
                            text: '&laquo; Précédent',
                            handler: function () {
                                var wizard = this.up('#wizard');
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    wizard.getLayout().setActiveItem('step-1');
                                }
                            }
                        },
                        {
                            text: 'Create Account',
                            handler: function () {
                                var wizard = this.up('#wizard');
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    var panel = form.up('panel');
                                    var newPassword = panel.down('form').getForm().findField('password').getValue();
                                    var userId = panel.down('form').getForm().findField('id').getValue();
                                    var grid=this.up('tabpanel').down('grid');
                                    var usersStore = grid.store;
                                    panel.userData.modules = [];
                                    Ext.each(dstGridStore.data.items, function (item, idx) {
                                        panel.userData.modules.push(item.data);
                                    });
                                    console.log(panel.userData);
                                    var layout = this.up('tabpanel').activeTab.getLayout();
                                    // si c'est une edition on ne change pas le password

                                    var storeRecord = usersStore.findRecord('id', userId);
                                    var userData = panel.userData.user

                                    if (panel.mode === 'edit') {
                                        // le mot de passe a t'il change
                                        if (panel.origPassword !== newPassword)
                                        {
                                            console.log('mot de passe changé');
                                            storeRecord.set('password', userData.password);
                                        }
                                        storeRecord.set('state', userData.state);
                                        storeRecord.set('level', userData.level);
                                        storeRecord.set('username', userData.username);
                                        storeRecord.set('firstname', userData.firstname);
                                        storeRecord.set('lastname', userData.lastname);
                                    }
                                    layout.setActiveItem(0);
                                    grid.store.sync({
                                        success: function () {
                                            layout.setActiveItem(0);
                                            grid.store.reload();
                                        }
                                    });
                                    //wizard.getLayout().setActiveItem('step-3');
                                }
                            }
                        }]
                },
                {
                    itemId: 'step-3',
                    html: 'Account was successfully created!'
                }
            ]
                    //renderTo: 'output'
        };
        return panel;
    }
});

