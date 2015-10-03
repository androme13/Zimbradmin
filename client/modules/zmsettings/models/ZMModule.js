/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.modules.zmsettings.models.ZMModule', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id'
        },
        {name: 'module'
        },
        {name: 'comment',
            editor: {
                allowBlank: false,
                //blankText: 'Le champ est obligatoire.',
            },
        },
    ]
});


// id,level,username,firstname,lastname