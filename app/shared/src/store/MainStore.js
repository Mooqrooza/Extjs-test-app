
const storeDataGrid = Ext.create('Ext.data.Store', {
  storeId: 'storedatagrid',
  xtype: 'storedatagrid',
  autoSync: true,
	proxy: {
   type: 'memory', reader: { type: 'json', rootProperty: 'numberParameters' }
  },
});

const storeReasonsData = Ext.create('Ext.data.Store', {
  storeId: 'storereasonsdata',
  xtype: 'storereasonsdata',
  autoSync: true,
  proxy: {
   type: 'memory', reader: { type: 'json', rootProperty: 'reasonsForRejec' }
  }
});

const storeFormAllData = Ext.create('Ext.data.Store', {
  storeId: 'storeformalldata',
  xtype: 'storeformalldata',
  require: ['MainUtils'],
  autoSync: true,
  proxy: {
 		 type: 'ajax',
 		 reader:{ type:'json' },
 		 url: MainUtils._fetchInitialiseData_url,
  },
	listeners: {
    load: function (store, records) {
      MainUtils.assignStoresAndValues( store.getRange()[0].data );
      MainUtils.setFormElementsInitialStates();
    }
  },
});

Ext.define('TestFormApp.store.MainStore', {
  alternateClassName: ['MainStore'],
  reference: 'mainstore ',
  xtype: 'mainstore',
});
