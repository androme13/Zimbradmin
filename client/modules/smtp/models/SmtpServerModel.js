/* 
 * SmtpServer Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.smtp.models.SmtpServerModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createIdCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        {
            name: 'server',
            flex: 2,
            editor: {
                editable: true,
                allowBlank: false,
                regex: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
                regexText: 'Veuillez saisir une adresse de serveur valide'
            },
            type: 'string',
            searchable: true
        },
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCommentCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCreatedCol(),
        {name: 'created_by', binded: false},
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createModifiedCol(),
        {name: 'modified_by', binded: false},
    ]
});


// id,level,username,firstname,lastname