/* 
 * UserWizard
 * (C) Androme 2015
 * 
 */
// wizard de création et d'edition d'un user

Ext.define('MyDesktop.modules.zmsettings.views.UserWizard', {
    create: function (grid) {
        var me; //sera generé à l'event afterrender
        // on fabrique la validity pour les passwords
        Ext.apply(Ext.form.field.VTypes, {
            password: function (val, field) {
                var origPwd = field.up('form').getForm().findField('password').rawValue;
                if (val !== origPwd)
                    return false;
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
        var dstGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.UserWizardModules');
        var dstGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
            store: dstGridStore,
            name: 'dst',
            rowEditing: false,
            title: "Modules de l'utilisateur",
            readOnly: true,
            multiSelect: true
        });
        // on cache les toolbars de la grid de destination
        dstGrid.hideToolbar(true);
        dstGrid.hidePagingbar(true);
        origGrid.on({
            afterRender: function (grid) {
                //grid.getStore().load();
            },
            itemdblclick: function (grid, record, item, index, e) {
                dstGrid = this.up().down('grid[name=dst]');
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
                    Ext.infoMsg.msg("Ajout de module à l'utilisateur",
                            "Vous avez ajouté le module<BR>" + record.data.module +
                            "<BR><SMALL>" + record.data.comment + "</SMALL>");
                }
            }
        });
        dstGrid.on({
            itemdblclick: function (grid, record, item, index, e) {
                grid.store.remove(record);
                Ext.infoMsg.msg("Suppression de module à l'utilisateur",
                        "Vous avez supprimé le module<BR>" + record.data.module +
                        "<BR><SMALL>" + record.data.comment + "</SMALL>");
            }
        });
        var panel = {
            name: 'userWizard',
            itemId: 'wizard',
            autoScroll: true,
            listeners: {
                afterrender: function () {
                    me = this;
                }},
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
                            combineErrors: true,
                            //msgTarget: 'side',
                            layout: 'vbox',
                            defaults: {
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
                            title: 'Mot de passe',
                            margins: '0 0 0 0',
                            combineErrors: true,
                            //msgTarget: 'side',
                            layout: 'vbox',
                            defaults: {
                                flex: 1,
                                margins: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'password',
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
                                    fieldLabel: 'Confirmation du mot de passe'
                                }
                            ]
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
                            text: 'Suivant &raquo;',
                            handler: function () {
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    me.userData.user = form.getForm().getValues();
                                    // on charge le store des modules afin qu'il soit raffraichit
                                    dstGridStore.getProxy().extraParams = {
                                        id: me.userData.user.id
                                    };
                                    origGridStore.load({
                                        scope: this,
                                        callback: function (records, operation, success) {
                                            // on charge les modules de l'user en cours
                                            dstGridStore.load();
                                        }
                                    });
                                    // on supprime le champ password2 des données
                                    delete me.userData.user.password2;
                                    me.setActiveItem('step-2');
                                }
                            }
                        }],
                },
                {
                    itemId: 'step-2',
                    xtype: 'form',
                    layout: 'fit',
                    items: [
                        {
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
                            name: 'valid',
                            handler: function () {
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    var userId = me.down('form').getForm().findField('id').getValue();
                                    var usersGrid = this.up('tabpanel').down('grid');
                                    //on peuple les modules choisis
                                    me.userData.modules = [];
                                    Ext.each(dstGridStore.data.items, function (item, idx) {
                                        me.userData.modules.push(item.data);
                                    });
                                    var layout = this.up('tabpanel').activeTab.getLayout();
                                    console.log(me.getMode());
                                    // si c'est une edition
                                    var userData = me.userData.user
                                    if (me.getMode() === 'edit') {
                                        var storeRecord = usersGrid.store.findRecord('id', userId);
                                        // le mot de passe a t'il change
                                        if (me.origPassword !== userData.password) {
                                            storeRecord.set('password', userData.password);
                                        }
                                        storeRecord.set('state', userData.state);
                                        storeRecord.set('level', userData.level);
                                        storeRecord.set('username', userData.username);
                                        storeRecord.set('firstname', userData.firstname);
                                        storeRecord.set('lastname', userData.lastname);
                                    }

                                    // si c'est un ajout
                                    if (me.getMode() === 'add') {
                                        var record = Ext.create(usersGrid.store.model.modelName);
                                        record.set('state', userData.state);
                                        record.set('level', userData.level);
                                        record.set('username', userData.username);
                                        record.set('password', userData.password);
                                        record.set('firstname', userData.firstname);
                                        record.set('lastname', userData.lastname);
                                        usersGrid.store.insert(0, record);
                                    }
                                    if (usersGrid.store.getModifiedRecords().length > 0)
                                    {
                                        usersGrid.store.sync({
                                            success: function () {
                                                console.log('success');

                                            },
                                            failure: function (batch, Opts) {
                                                console.log('failure', batch, Opts);

                                            },
                                            callback: function ()
                                            {
                                                layout.setActiveItem(0);
                                                usersGrid.store.reload();
                                            }
                                        });
                                    }
                                    else
                                    {
                                        layout.setActiveItem(0);
                                        if (me.getMode() === 'edit')
                                        {
                                            Ext.infoMsg.msg("Modification de l'utilisateur",
                                                    "Aucune modification n'a été effectuée");
                                        }
                                    }
                                }
                            }
                        }]
                }
            ],
            setMode: function (mode, record) {
                me.mode = mode;
                me.resetForm();
                switch (mode) {
                    case "edit":
                        me.setTitle("Edition d'un utilisateur");
                        me.down('button[name=valid]').setText('Modifier');
                        var form = me.down('form');
                        form.loadRecord(record);
                        var randomPassword = (Math.floor(Math.random() * (10000)) + 10000);
                        me.origPassword = randomPassword.toString();
                        form.getForm().findField('password').setValue(randomPassword.toString());
                        form.getForm().findField('password2').setValue(randomPassword.toString());
                        break;
                    case "add":
                        me.setTitle("Ajout d'un utilisateur");
                        me.down('button[name=valid]').setText('Creer');
                        break;
                }
                me.setActiveItem(0);
            },
            getMode: function () {
                return me.mode;
            },
            resetForm: function () {
                Ext.each(me.query('form'), function (item, idx) {
                    item.getForm().reset(true);
                });
            },
            setActiveItem: function (item) {
                me.getLayout().setActiveItem(item);
            }
            //renderTo: 'output'
        };
        return panel;
    },
});

