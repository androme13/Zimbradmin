/* 
 * ZMUser Model
 * (C) Androme 2015
 * 
 */
 
Ext.define('MyDesktop.modules.zmsettings.models.ZMUserModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        {name: 'id', hidden: true},
        {name: 'state',
            text: 'Etat',
            defaultValue: 2,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                queryMode: 'local',
                store: [[0, 'Inactif'], [1, 'Bloqué'], [2, 'Actif']],
                editable: false,
            },
            renderer: function (value, meta) {
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
            },
        },
        {name: 'level',
            text: 'Niveau',
            defaultValue: 1,
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
            name: 'username',
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true
        },
        {
            name: 'firstname',
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true

        },
        {
            name: 'lastname',
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true

        },
        {name: 'created_date', type: 'date', text: 'Crée le',
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
        {name: 'created_by', binded: false},
        {name: 'modified_date', type: 'date', text: 'Modifié le',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var nameModifier = 'inconnu';
                var idModifier = record.get('modified_by');
                var st = this.store;
                var index = st.find('id', idModifier);
                if (index >= 0)
                    nameModifier = st.getAt(index).get('username');
                if (record.data.modified_date === record.data.created_date)
                {
                    return 'non modifié';
                }
                else
                {
                    return 'le : <i>' + value + '</i><br>par: <i>' + idModifier + '</i></br>';
                }
            }
        },
        {name: 'modified_by', binded: false},
    ]
});


// id,level,username,firstname,lastname