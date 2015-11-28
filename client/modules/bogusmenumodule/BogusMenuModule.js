/*!
* Ext JS Library 4.0
* Copyright(c) 2006-2011 Sencha Inc.
* licensing@sencha.com
* http://www.sencha.com/license
*/

Ext.define('MyDesktop.modules.bogusmenumodule.BogusMenuModule', {
    extend: 'MyDesktop.modules.bogusmodule.BogusModule',
    id: 'bogusmenumodule',
    init : function() {
        
        this.launcher = {
            text: 'More items',
            iconCls: 'bogus',
            handler: function() {
                return false;
            },
            menu: {
                items: [
            
                {
                text: 'Window ',
                iconCls:'bogus',
                handler : this.createWindow,
                scope: this,
                //windowId: this.windowIndex
            }
                ]
            }
        };


            /*his.launcher.menu.items.push({
                text: 'Window ',
                iconCls:'bogus',
                handler : this.createWindow,
                scope: this,
                //windowId: this.windowIndex
            });*/
        
    }
});