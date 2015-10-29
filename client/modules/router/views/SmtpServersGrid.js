/*
 * File: UserGrid.js
 *
 */


Ext.define('MyDesktop.modules.zmsettings.views.UsersGrid', {
    extend: 'Ext.grid.Panel',
    initComponent: function (args) {
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: true,
            //saveBtnText: "Enregistrer",
            //cancelBtnText: "Annuler",
        });
        this.stateRenderer = function (value, meta, record, rowindx, colindx, store) {
            switch (value) {
                case 0 :
                    meta.css = 'zmsettings-disabled_entry24';
                    meta.tdAttr = 'data-qtip="Inactif"';
                    break;
                case 1 :
                    meta.css = 'zmsettings-blocked_entry24';
                    meta.tdAttr = 'data-qtip="Bloqué"';
                    break;
                case 2 :
                    meta.css = 'zmsettings-enabled_entry24';
                    meta.tdAttr = 'data-qtip="Actif"';
                    break;
                case 3 :
                    meta.css = 'zmsettings-deleted_entry24';
                    meta.tdAttr = 'data-qtip="Supprimé"';
                    break;
            }
            return '';
        };

        Ext.apply(this, {
            plugins: [this.rowEditing],
            store: this.store,
            title: 'Utilisateurs',
            columns: [
                {
                    //xtype: 'gridcolumn',
                    width: 50,
                    dataIndex: 'state',
                    text: 'Etat',
                    editor: {
                        xtype: 'combo',
                        valueField: 'value',
                        queryMode: 'local',
                        store: [[0, 'Inactif'], [1, 'Bloqué'], [2, 'Actif']],
                        editable: false,
                    },
                    renderer: this.stateRenderer
                },
                {
                    //xtype: 'gridcolumn',
                    sortable: false,
                    dataIndex: 'id',
                    text: 'id',
                    hidden: true,
                    //editor: {
                    //xtype: 'textfield',
                    //allowBlank: false,
                    //editable: false
                    //}
                },
                {
                    //xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'username',
                    text: 'Nom utilisateur',
                    //vtype: 'email',
                    groupable: false,
                    //flex: 1,
                    //locked   : true,
                    editor: {
                        //xtype: 'textfield',
                        allowBlank: false,
                        blankText: 'Le champ est obligatoire.',
                        //emailText: "l'entrée doit être sous forme d'Email \BR nom@domaine.com",
                        //vtype: 'email',
                    }
                },
                {
                    //xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'firstname',
                    text: 'Nom',
                    //vtype: 'email',
                    groupable: false,
                    //flex: 1,
                    editor: {
                        //xtype: 'textfield',
                        allowBlank: false,
                        blankText: 'Le champ est obligatoire.',
                        //emailText: "l'entrée doit être sous forme d'Email \BR nom@domaine.com",
                        //vtype: 'email',
                    }
                },
                {
                    //xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'lastname',
                    text: 'Prénom',
                    //vtype: 'email',
                    groupable: false,
                    //flex: 1,
                    editor: {
                        //xtype: 'textfield',
                        allowBlank: false,
                        blankText: 'Le champ est obligatoire.',
                        //emailText: "l'entrée doit être sous forme d'Email \BR nom@domaine.com",
                        //vtype: 'email',
                    }
                },
                {
                    //xtype: 'gridcolumn',
                    width: 75,
                    dataIndex: 'level',
                    text: 'Niveau',
                    //flex: 1,
                    editor: {
                        xtype: 'combo',
                        editable: false,
                        //typeAhead: true,
                        triggerAction: 'all',
                        store: [
                            [0, 'invité'],
                            [1, 'utilisateur'],
                            [2, 'super utilisateur'],
                            [3, 'administrateur'],
                            [4, 'super administrateur']
                        ]

                    },
                    renderer: function (value) {
                        var backval = "";
                        switch (value)
                        {
                            case 0 :
                                backval = "invité";
                                break;
                            case 1 :
                                backval = "utilisateur";
                                break;
                            case 2 :
                                backval = "super utilisateur";
                                break;
                            case 3 :
                                backval = "administrateur";
                                break;
                            case 4 :
                                backval = "super administrateur";
                                break;
                            default:
                                backval = "inconnu";
                                break;
                        }
                        return backval;
                    }
                },
                {
                    //xtype: 'gridcolumn',
                    width: 140,
                    dataIndex: 'created_date',
                    text: 'Infos création',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var nameCreator = 'inconnu';
                        var idCreator = record.get('created_by');
                        var st = this.store;
                        var index = st.find('id', idCreator);
                        if (index >= 0)
                            nameCreator = st.getAt(index).get('username');
                        if (value == null)
                            value = 'Inconnu';
                        return 'le : <i>' + value + '</i><br>par: <i>' + nameCreator + '</i></br>';
                    },
                },
                {
                    xtype: 'gridcolumn',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var nameModifier = 'inconnu';
                        var idModifier = record.get('modified_by');
                        var st = this.store;
                        var index = st.find('id', idModifier);
                        if (index >= 0)
                            nameModifier = st.getAt(index).get('username');
                        if (record.data.modified_date = record.data.created_date)
                        {
                            return 'non modifié';
                        }
                        else
                        {
                            return 'le : <i>' + value + '</i><br>par: <i>' + nameModifier + '</i></br>';
                        }
                    },
                    width: 140,
                    dataIndex: 'modified_date',
                    text: 'Infos modification',
                },
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.store,
                displayInfo: true,
                pageSize: 50//ExtDesktop.user.infos.gridPageSize,
            }),
            dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                            xtype: 'trigger',
                            triggerCls: 'x-form-clear-trigger',
                            id: 'searchappuser',
                            emptyText: 'Recherche ...',
                            enableKeyEvents: true,
                            action: 'keypress',
                            onTriggerClick: function () {
                                this.fireEvent('ontriggerclick', this);
                            }
                        },
                        '-',
                        {
                            cls: 'user-add-icon24',
                            id: 'addappuser',
                            width: 24,
                            height: 24,
                            tooltip: '<b>Aide</b><br/>Ajouter une entrée<br>',
                            clickEvent: 'mousedown',
                            action: 'add',
                        },
                        {
                            cls: 'user-delete-icon24',
                            id: 'removeappuser',
                            disabled: true,
                            width: 24,
                            height: 24,
                            tooltip: "<b>Aide</b><br/>Supprimer l'entrée selectionnée<br>",
                            clickEvent: 'mousedown',
                            action: 'remove',
                        },
                    ]
                }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                //loadingText: 'Veuillez patienter...',
            },
        });
        this.callParent(arguments);
    },
});