/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.modules.settings.Settings', {
   // extend: ['Ext.app.Controller','Ext.ux.desktop.Module'],
    extend: 'Ext.ux.desktop.Module',
    id: 'settings-win',
    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',
        'Ext.ux.desktop.Wallpaper',
        //view
        //'MyDesktop.modules.settings.views.wallpaper',
        // models
        'MyDesktop.modules.settings.models.WallpaperModel',
        //stores
        'MyDesktop.modules.settings.stores.Wallpapers'
    ],
    //stores:['MyDesktop.modules.settings.stores.WallpaperModel'],
    init: function () {
        this.launcher = {
            startmenu: false,
            title: 'Mes paramètres',
            text: 'Mes paramètres',
            iconCls: this.id+'-icon',
            shortcutCls: this.id+'-shortcut',
        };
    },

    createWindow: function () {
        var me = this;
        var desktop = this.app.getDesktop();
        this.preview = Ext.create('widget.wallpaper');
        this.preview.setWallpaper(this.selected);
        this.tree = this.createTree();
        //var desktop = scope.desktop.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            win = desktop.createWindow({
                //closable: false,
                constrainHeader: true,
                //header: false,
                iconCls: me.launcher.iconCls,
                id: this.id,
                layout: 'anchor',
                maximizable: false,
                //minimizable: false,
                //modal: true,
                resizable: false,
                title: me.launcher.title,
                width: 640,
                height: 480,
                border: false,
                items: [
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
                buttons: [
                    {text: 'Valider', handler: me.onOK, scope: me},
                    {text: 'Annuler', handler: me.close, scope: me}
                ]

            });
        }
        return win;
    },
    getTextOfWallpaper: function (path) {
        var text = path, slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash + 1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');
        return text;
    },
    onOK: function (btn) {
        var win=btn.up('window');
        var me = this;
        if (me.selected) {
            me.app.desktop.setWallpaper(me.selected, me.stretch);
        }
        win.close();
        
    },
    createTree: function () {
        var me = this;

        /*function child(img) {
            return {qtip: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true};
        };*/
        var wallPaperTreeStore = Ext.create('MyDesktop.modules.settings.stores.Wallpapers');
        
        var tree = new Ext.tree.Panel({
            title: 'Desktop Background',
            rootVisible: false,
            lines: false,
            autoScroll: true,
            width: 150,
            region: 'east',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: {fn: this.setInitialSelection, delay: 100},
                select: this.onSelect,
                scope: this
            },
            /*store: new Ext.data.TreeStore({
                model: 'MyDesktop.modules.settings.model.WallpaperModel',
                root: {
                    text: 'Wallpaper',
                    expanded: true,
                    children: [
                        {text: "None", iconCls: '', leaf: true},
                        child('Blue-Sencha.jpg'),
                        child('Dark-Sencha.jpg'),
                        child('Wood-Sencha.jpg'),
                        child('blue.jpg'),
                        child('desk.jpg'),
                        child('desktop.jpg'),
                        child('desktop2.jpg'),
                        child('sky.jpg')
                    ]
                }
            })*/
            //store: 'WalMyDesktop.modules.settings.stores.Wallpapers'
            store:wallPaperTreeStore
        });
        return tree;
    },
    onSelect: function (tree, record) {
        var me = this;
        console.log(record.data);
        console.log(this);
        if (record.data.qtip !== '') {
            me.selected = 'wallpapers/' + record.data.qtip;
        } else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }
        me.preview.setWallpaper(me.selected);
    },
    setInitialSelection: function () {
        //console.log(this);
        var s = this.app.desktop.getWallpaper();
        if (s) {
            var path = '/Wallpapers/' + this.getTextOfWallpaper(s);
            this.tree.selectPath(path, 'text');
        }
    }

});

/*iconCls: this.launcher.iconCls,
 layout: 'anchor',
 title: 'Mes paramètres',
 modal: true,
 width: 640,
 height: 480,
 border: false,
 initComponent: function () {
 var me = this;
 /*me.launcher = {
 title: 'Mes paramètres',
 text: 'Mes paramètres',
 iconCls: 'settings16'
 };
 me.selected = me.desktop.getWallpaper();
 me.stretch = me.desktop.wallpaper.stretch;
 
 me.preview = Ext.create('widget.wallpaper');
 me.preview.setWallpaper(me.selected);
 me.tree = me.createTree();
 
 me.buttons = [
 {text: 'Valider', handler: me.onOK, scope: me},
 {text: 'Annuler', handler: me.close, scope: me}
 ];
 
 me.items = [
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
 ];
 
 me.callParent();
 },
 createTree: function () {
 var me = this;
 
 function child(img) {
 return {qtip: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true};
 }
 
 var tree = new Ext.tree.Panel({
 title: 'Desktop Background',
 rootVisible: false,
 lines: false,
 autoScroll: true,
 width: 150,
 region: 'east',
 split: true,
 minWidth: 100,
 listeners: {
 afterrender: {fn: this.setInitialSelection, delay: 100},
 select: this.onSelect,
 scope: this
 },
 store: new Ext.data.TreeStore({
 model: 'MyDesktop.modules.settings.model.WallpaperModel',
 root: {
 text: 'Wallpaper',
 expanded: true,
 children: [
 {text: "None", iconCls: '', leaf: true},
 child('Blue-Sencha.jpg'),
 child('Dark-Sencha.jpg'),
 child('Wood-Sencha.jpg'),
 child('blue.jpg'),
 child('desk.jpg'),
 child('desktop.jpg'),
 child('desktop2.jpg'),
 child('sky.jpg')
 ]
 }
 })
 });
 
 return tree;
 },
 getTextOfWallpaper: function (path) {
 var text = path, slash = path.lastIndexOf('/');
 if (slash >= 0) {
 text = text.substring(slash + 1);
 }
 var dot = text.lastIndexOf('.');
 text = Ext.String.capitalize(text.substring(0, dot));
 text = text.replace(/[-]/g, ' ');
 return text;
 },
 onOK: function () {
 var me = this;
 if (me.selected) {
 me.desktop.setWallpaper(me.selected, me.stretch);
 }
 me.destroy();
 },
 onSelect: function (tree, record) {
 var me = this;
 console.log(record.data);
 console.log(this);
 if (record.data.qtip !== '') {
 me.selected = 'wallpapers/' + record.data.qtip;
 } else {
 me.selected = Ext.BLANK_IMAGE_URL;
 }
 me.preview.setWallpaper(me.selected);
 },
 setInitialSelection: function () {
 var s = this.desktop.getWallpaper();
 if (s) {
 var path = '/Wallpapers/' + this.getTextOfWallpaper(s);
 this.tree.selectPath(path, 'text');
 }
 }
 });*/
