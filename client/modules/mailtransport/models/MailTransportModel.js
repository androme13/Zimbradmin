/* 
 * MailTransport Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.mailtransport.models.MailTransportModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createIdCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        {name: 'domain',
            type: 'string',
            searchable: true,
            exportable: true,
            editor: {
                vtype: 'email',
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            }
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
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCreatedCol(),
        {name: 'created_by', binded: false},
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createModifiedCol(),
        {name: 'modified_by', binded: false},
    ]
});