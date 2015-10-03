/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('MyDesktop.modules.settings.views.wallpaper', {
    
//var view = new Object();
this : [
                    {
                        anchor: '0 -30',
                        border: false,
                        layout: 'border',
                        items: [
                            me.tree,
                            {
                                xtype: 'panel',
                                title: 'Preview',
                                region: 'center',
                                layout: 'fit',
                                items: [me.preview]
                            }
                        ]
                    },
                    {
                        xtype: 'checkbox',
                        boxLabel: 'Stretch to fit',
                        checked: me.stretch,
                        listeners: {
                            change: function (comp) {
                                me.stretch = comp.checked;
                            }
                        }
                    }
                ],
                
}
        
        
        );