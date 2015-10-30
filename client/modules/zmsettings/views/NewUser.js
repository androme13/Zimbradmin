/* 
 * NewUser
 * (C) Androme 2015
 * 
 */
// wizard de création d'user

Ext.define('MyDesktop.modules.zmsettings.views.NewUser', {
    create: function (record) {
        var panel = {
            title: "Création d'un nouvel utilisateur",
            itemId: 'wizard',
            width: 400,
            height: 150,
            layout: 'card',
            defaults: {
                border: false,
                bodyPadding: 20
            },
            items: [
                {
                    itemId: 'step-1',
                    xtype: 'form',
                    layout: 'anchor',
                    defaults: {anchor: '100%'},
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nom utilisateur',
                            maxLength: 64,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'prénom',
                            maxLength: 64,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nom',
                            maxLength: 64,
                            allowBlank: false
                        }
                    ],
                    buttons: [
                        {
                            text: 'Annuler'
                        },
                        {
                            text: 'Next',
                            handler: function () {
                                var wizard = this.up('#wizard');
                                var form = this.up('form');

                                if (form.getForm().isValid()) {
                                    wizard.getLayout().setActiveItem('step-2');
                                }
                            }
                        }]
                },
                {
                    itemId: 'step-2',
                    xtype: 'form',
                    layout: 'anchor',
                    defaults: {anchor: '100%'},
                    items: [
                        {
                            xtype: 'textfield',
                            inputType: 'password',
                            allowBlank: false,
                            fieldLabel: 'Password'
                        },
                        {
                            xtype: 'textfield',
                            inputType: 'password',
                            allowBlank: false,
                            fieldLabel: 'Confirmation'
                        }
                    ],
                    buttons: [
                        {
                            text: 'Annuler'
                        },
                        {
                            text: 'Create Account',
                            handler: function () {
                                var wizard = this.up('#wizard');
                                var form = this.up('form');

                                if (form.getForm().isValid()) {
                                    wizard.getLayout().setActiveItem('step-3');
                                }
                            }
                        }]
                },
                {
                    itemId: 'step-3',
                    html: 'Account was successfully created!'
                }
            ],
            //renderTo: 'output'
        };
        return panel;
    }
});

