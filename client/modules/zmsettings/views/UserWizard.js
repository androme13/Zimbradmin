/* 
 * UserWizard
 * (C) Androme 2015
 * 
 */
// wizard de création et d'edition d'un user

Ext.define('MyDesktop.modules.zmsettings.views.UserWizard', {
    create: function (grid, modulesStore) {
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
        Ext.apply(Ext.form.field.VTypes, {
            username: function (val, field) {
                if (field.valid === true)
                    return true;
                return false;
            },
            usernameText: "Ce nom d'utilisateur existe déja"
        });
        // on fabrique le filtre de saisie
        var mask = /^[a-zA-Z0-9\-\_\.]*$/;
        var origGrid = Ext.create('MyDesktop.modules.common.views.paginggrid.PagingGrid', {
            store: modulesStore,
            name: 'src',
            rowEditing: false,
            title: 'Modules disponibles',
            readOnly: true,
            multiSelect: true,
            margins: '0 5 0 0'
        });
        var dstGridStore = Ext.create('MyDesktop.modules.zmsettings.stores.UserWizardModules');
        var dstGrid = Ext.create('MyDesktop.modules.common.views.paginggrid.PagingGrid', {
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
                var dstGrid = this.up().down('grid[name=dst]');
                var userId = me.down('form').getForm().findField('id').getValue();
                if (dstGrid.getStore().findRecord('moduleid', record.data.id))
                {
                    Ext.infoMsg.msg("Ajout de module à l'utilisateur",
                            "Vous avez deja ajouté le module<BR>" + record.data.module,
                            2000,
                            'orange');
                }
                else
                {
                    // on transforme le record pour l'adapter à la nouvelle grille
                    var newRecord = Ext.create('MyDesktop.modules.zmsettings.models.UserWizardModuleModel');
                    newRecord.data.id = 0;
                    newRecord.data.userid = userId;
                    newRecord.data.moduleid = record.data.id;
                    dstGrid.store.add(newRecord);
                }
            }
        });
        dstGrid.on({
            itemdblclick: function (grid, record, item, index, e) {
                srcGridStore = this.up().down('grid[name=src]').getStore();
                var srcModuleRecord = srcGridStore.findRecord('id', record.get('moduleid'));
                grid.store.remove(record);
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
                    layout: 'anchor',
                    bodyPadding: 5,
                    //defaults: {anchor: '100%'},
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Etat et niveau du compte',
                            margins: '0 0 0 0',
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
                                    store: [[0, 'Inactif'], [1, 'Actif'], [2, 'Bloqué']],
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
                                msgTarget: 'side',
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
                                    vtype: 'username',
                                    //msgTarget: 'side',
                                    maxLength: 64,
                                    // on ajoute la propriété valid pour verfier si il existe deja ou pas.
                                    valid: true,
                                    allowBlank: false,
                                    enableKeyEvents: true,
                                    listeners: {
                                        keypress: function (obj, e)
                                        {
                                            me.usernameFieldKeyPress(obj, e);
                                        }, buffer: 500
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'firstname',
                                    fieldLabel: 'Prénom',
                                    //msgTarget: 'side',
                                    maxLength: 64,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'lastname',
                                    fieldLabel: 'Nom',
                                    // msgTarget: 'side',
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
                            layout: 'vbox',
                            defaults: {
                                //flex: 1,
                                msgTarget: 'side',
                                margins: '5 5 5 5'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'password',
                                    inputType: 'password',
                                    //msgTarget: 'side',
                                    maxLength: 64,
                                    allowBlank: false,
                                    fieldLabel: 'Mot de passe'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'password2',
                                    vtype: 'password',
                                    inputType: 'password',
                                    //msgTarget: 'side',
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
                                me.cancel();
                            }
                        },
                        {
                            text: 'Suivant &raquo;',
                            handler: function () {
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    me.userData.user = form.getForm().getValues();
                                    if (me.getMode() === 'add')
                                        me.userData.user.id = "0";
                                    dstGridStore.getProxy().setExtraParam("id", me.userData.user.id);
                                    origGrid.getStore().load({
                                        scope: this,
                                        callback: function (records, operation, success) {
                                            dstGridStore.load();
                                        }
                                    });
                                    // on supprime le champ password2 des données
                                    delete me.userData.user.password2;
                                    me.setActiveItem('step-2');
                                }
                            }
                        }]
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
                                me.cancel();
                                //this.up('tabpanel').activeTab.getLayout().setActiveItem(0);
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
                            text: 'Account',
                            name: 'valid',
                            handler: function () {
                                var form = this.up('form');
                                if (form.getForm().isValid()) {
                                    me.editAccount(form);
                                }
                            }
                        }]
                }
            ],
            editAccount: function (form) {
                var userId = me.down('form').getForm().findField('id').getValue();
                var usersGrid = this.up('tabpanel').down('grid');
                var dstGridStore = this.up().down('grid[name=dst]').getStore();

                //on peuple les modules choisis
                me.userData.modules = [];
                Ext.each(dstGridStore.data.items, function (item, idx) {
                    me.userData.modules.push(item.data);
                });
                var layout = this.up('tabpanel').activeTab.getLayout();
                // si c'est une edition
                var userData = me.userData.user;
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
                        success: function (batch, opts) {
                            //si les modules ont été modifies
                            console.log('success', batch);
                            console.log(dstGrid.store);
                            if (dstGrid.store.getModifiedRecords().length > 0)
                            {
                                if (me.getMode() === 'edit')
                                {
                                    //dstGrid.store.getProxy().setParam('id', userId);
                                }
                                else
                                {
                                    // si c'est un ajout d'user on recupere l'id affecté
                                    var id = batch.operations[0].response.result.data[0].insertId;
                                    // et on modifie l'userid enregistré dans les modules ajoutés
                                    dstGrid.store.data.items.every(function (item) {
                                        item.data.userid=id;
                                        return true;
                                    });
                                }
                                dstGrid.store.sync({
                                    success: function () {
                                        // dstGridStore.sync();
                                        if (me.getMode() === 'edit')
                                        {
                                            Ext.infoMsg.msg("Modification des modules l'utilisateur",
                                                    "Les modifications sur les modules de l'utilisateur ont été effectuée");
                                        }
                                        //else
                                        //{
                                        //    Ext.infoMsg.msg("Ajout de l'utilisateur",
                                        //            "L'ajout a été effectuée");
                                        //}
                                    },
                                    failure: function (batch, Opts) {
                                        console.log('failure', batch, Opts);
                                    },
                                    callback: function ()
                                    {
                                    }

                                });
                            }
                           /* else
                            {
                                if (me.getMode() === 'edit')
                                {
                                    Ext.infoMsg.msg("Modification de l'utilisateur",
                                            "Les modifications ont été effectuée");
                                }
                                else
                                {
                                    Ext.infoMsg.msg("Ajout de l'utilisateur",
                                            "L'ajout a été effectuée");
                                }
                            }*/

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
                //si l'utilisateur n'a pas été modifié mais
                // que ses modules l'ont été.
                if ((dstGrid.store.getModifiedRecords().length > 0 || dstGrid.store.getRemovedRecords().length > 0) && usersGrid.store.getModifiedRecords().length === 0)
                {
                    dstGrid.store.sync({
                        success: function () {
                            if (me.getMode() === 'edit')
                            {
                                Ext.infoMsg.msg("Modification de l'utilisateur",
                                        "Les modifications ont été effectuée");
                            }
                            else
                            {
                                Ext.infoMsg.msg("Ajout de l'utilisateur",
                                        "L'ajout a été effectuée");
                            }
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
                    // layout.setActiveItem(0);

                }
            },
            cancel: function () {
                me.resetForm();
                this.up('tabpanel').activeTab.getLayout().setActiveItem(0);
            },
            setMode: function (mode, record) {
                me.mode = mode;
                me.resetForm();
                me.userData = {};
                switch (mode) {
                    case "edit":
                        me.setTitle("Edition d'un utilisateur (" + record.data.username + ")");
                        me.down('button[name=valid]').setText('Modifier');
                        var form = me.down('form');
                        var usernameField = form.down('textfield[name=username]');
                        form.loadRecord(record);
                        usernameField.origUsername = usernameField.value;
                        var randomPassword = (Math.floor(Math.random() * (10000)) + 10000);
                        me.origPassword = randomPassword.toString();
                        // on set les champs passwords avec une valeur random
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
                var usernameField = me.down('textfield[name=username]');
                usernameField.origUsername = null;
                usernameField.valid = true;
            },
            setActiveItem: function (item) {
                me.getLayout().setActiveItem(item);
            },
            usernameFieldKeyPress: function (field, e) {


                ExtRemote.core.DXUser.isExistUserByName({'search': field.value},
                function (result, event) {
                    //si la session existe cote serveur
                    if (result.data.length > 0)
                    {
                        // si on est en mode edition on gere l'username différemment
                        // pour la verif
                        if (me.getMode() === 'edit' && field.value === field.origUsername)
                            field.valid = true;
                        else
                            field.valid = false;
                    } else
                    {
                        field.valid = true;
                    }
                    field.validate();
                }
                );
            }
            //renderTo: 'output'
        };
        return panel;
    }
});

