
Ext.define('MyDesktop.modules.mailtransport.models.MailTransportModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        {name: 'id',hidden: true
        },
        {name: 'domain',
            type: 'string',
            searchable: true,
            exportable: true,
            editor: {
                vtype:'email',
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            },
        },
        {name: 'transport',
            type: 'string',
            searchable: true,
            exportable: true,
            editor: {
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            },
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return value.replace("smtp:", "");
            },
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
                return 'le : <i>' + value + '</i><br>par: <i>' + idCreator + '</i></br>';
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
                if (record.data.modified_date == record.data.created_date)
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