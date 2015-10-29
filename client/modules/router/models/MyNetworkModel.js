/* 
 * ZMUser Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.router.models.MyNetworkModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        {name: 'id', hidden: true},
        {name: 'state',
            text: 'Etat',
            type: 'int',
            defaultValue: 1,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                queryMode: 'local',
                store: [[0, 'Inactif'], [1, 'Actif']],
                editable: false,
            },
            renderer: function (value, meta) {
                switch (value) {
                    case 0 :
                        meta.css = 'router-disabled_entry24';
                        meta.tdAttr = 'data-qtip="Inactif"';
                        break;
                    case 1 :
                        meta.css = 'router-enabled_entry24';
                        meta.tdAttr = 'data-qtip="Bloqué"';
                        break;
                }
                return '';
            },
        },
        {
            name: 'network',
            editor: {
                editable: true,
                allowBlank: false,
                regex: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
                regexText: 'Veuillez saisir une adresse CIDR du style 10.1.1.128/32'
            },
            type: 'string',
            searchable: true
        },
        {
            name: 'comment',
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string'
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