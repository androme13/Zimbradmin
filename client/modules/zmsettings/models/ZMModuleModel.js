/* 
 * ZMModule Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.models.ZMModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            hidden: true
        },
        {
            name: 'state',
            type: 'int',
            renderer: function (value, meta) {
                switch (value) {
                    case 0 :
                        meta.css = 'zmsettings-disabled_entry24';
                        meta.tdAttr = 'data-qtip="Inactif"';
                        break;
                    case 1 :
                        meta.css = 'zmsettings-enabled_entry24';
                        meta.tdAttr = 'data-qtip="Actif"';
                        break;
                }
                return '';
            },
        },
        {
            name: 'module',
            editor: {
                allowBlank: false,
            },
            type: 'string'
        },
        {
            name: 'comment',
            editor: {
                allowBlank: false,
            },
            type: 'string'
        }
    ]
});


// id,level,username,firstname,lastname