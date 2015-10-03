Ext.define('MyDesktop.modules.settings.stores.Wallpapers', {
    extend: 'Ext.data.TreeStore',
    model: 'MyDesktop.modules.settings.models.WallpaperModel',
    storeId:"wallpapers",
    proxy:{
        type:'direct',
        directFn:'ExtRemote.DXUser.getwallpapers',
        reader:{
            root:'data'
        }
                                               
    },
    /*init: function(){
      console.log('inittree');  
    },/*
   /*child: function (img) {
        return {qtip: img, text: me.getTextOfWallpaper(img), iconCls: '', leaf: true};
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
    },*/
    /*root: {
                    text: 'Wallpaper',
                    expanded: true,
                    children: [
                        {text: "None", iconCls: '', leaf: true},
                        {qtip: "Blue-Sencha.jpg",text: "blue sencha", iconCls: '', leaf: true},
                        
                        //this.child('Blue-Sencha.jpg'),
                        /*child('Dark-Sencha.jpg'),
                        child('Wood-Sencha.jpg'),
                        child('blue.jpg'),
                        child('desk.jpg'),
                        child('desktop.jpg'),
                        child('desktop2.jpg'),
                        child('sky.jpg')
                    ]
                },*/
    
    
    /*data: [
        {firstName: 'Seth', age: '34'},
        {firstName: 'Scott', age: '72'},
        {firstName: 'Gary', age: '19'},
        {firstName: 'Capybara', age: '208'}
    ],*/

});