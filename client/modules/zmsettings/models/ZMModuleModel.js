/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.modules.zmsettings.models.ZMModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', hidden: true
        },
        {name: 'module',
            editor: {
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            },
            type: 'string'
        },
        {name: 'comment',
            editor: {
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            },
            type: 'string'
        },
    ]
});


// id,level,username,firstname,lastname