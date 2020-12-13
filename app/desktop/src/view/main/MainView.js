Ext.define('TestFormApp.view.main.MainView', {
    extend: 'Ext.Container',
    xtype: 'mainview',
    viewModel: { type: 'formviewmodel' },
    requires: [ 'Ext.layout.Center' ],
    layout: 'center',
    items: [ { xtype: 'formview', }],
    listeners: {
      painted: {
        element: 'element',
        fn: () => Ext.getCmp('formview').show(),
      },
    }
});
