/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.StartMenu', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.menu.Menu',
        'Ext.toolbar.Toolbar'
    ],
    ariaRole: 'menu',
    cls: 'x-menu ux-start-menu',
    defaultAlign: 'bl-tl',
    iconCls: 'user',
    floating: true,
    shadow: true,
    // We have to hardcode a width because the internal Menu cannot drive our width.
    // This is combined with changing the align property of the menu's layout from the
    // typical 'stretchmax' to 'stretch' which allows the the items to fill the menu
    // area.
    width: 300,
    initComponent: function () {
        var me = this, menu = me.menu;

        me.menu = new Ext.menu.Menu({
            cls: 'ux-start-menu-body',
            border: false,
            floating: false,
            items: menu
        });
        me.menu.layout.align = 'stretch';

        me.items = [me.menu];
        me.layout = 'fit';

        Ext.menu.Manager.register(me);
        me.callParent();
        // TODO - relay menu events

        me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
            dock: 'right',
            cls: 'ux-start-menu-toolbar',
            vertical: true,
            width: 100,
            listeners: {
                add: function (tb, c) {
                    c.on({
                        click: function () {
                            me.hide();
                        }
                    });
                }
            }
        }, me.toolConfig));

        me.toolbar.layout.align = 'stretch';
        me.addDocked(me.toolbar);

        delete me.toolItems;
    },
    addMenuItem: function () {
        // le code accepete l'ajout un par un d'un menu actuellement.
        var cmp = this.menu;
        cmp.add.apply(cmp, arguments);
        /*console.log("debut menu",cmp);
        var item = arguments[0];
        // si l'item est contenu dans un menu
        if (item.menu) {
            var menu = cmp.items.get(item.text + '-subMenu');
            // si le menu existe deja
            if (menu) {               
                console.log("menu deja existant id ",menu.id);
                console.log("item à ajouter ",arguments[0].menu.items);
                console.log(cmp);
                //cmp.insert(id,arguments[0].menu.items)
                console.log("menu : ",menu);
                 //var menuItem = Ext.create("Ext.menu.Item", {text: menuItems[i].name, menu: subMenu});
        //menu.add(menuItem);
                //cmp.insert(menu,arguments[0].menu.items);
                
                
                //cmp.insert(menu.id,arguments[0].menu.items);
                cmp.add.apply(cmp, arguments);
                console.log(item.menu.items.text + ' est dans le menu ' + menu.id);
                console.log("---------------------------");
                //cmp.insert(id, arguments[0].menu.items);

            }
            // si il n'existe pas
            else
            {
                item.id = item.text + '-subMenu';
                console.log("nouveau menu", item.id);
                console.log("item à ajouter ",arguments[0].menu.items);
                
                cmp.add.apply(cmp, arguments);
                console.log(item.menu.items.text + ' est dans le menu ' + item.id);
                console.log("---------------------------");
            }
            

        }
        else
        {
            cmp.add.apply(cmp, arguments);
            //cmp.add(arguments);
            console.log("item à ajouter sans menu ",arguments[0]);
            console.log("---------------------------");
        }
        // console.log(item);
        // console.log(cmp);*/

    },
    addToolItem: function () {
        var cmp = this.toolbar;
        cmp.add.apply(cmp, arguments);
    }
}); // StartMenu
