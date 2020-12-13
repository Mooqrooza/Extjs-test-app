const formDataGridColumns = [
   { text: 'Параметр', flex: 1, dataIndex: 'name', tools: false, },
   { text: 'На согласование',
     flex: 1,
     dataIndex: 'agreeProps',
     editable: true,
     editor: { xtype: 'numberfield' },
   },
   { xtype: 'column',
        border: false, flex: 1, dataIndex: 'previousProps',
        viewmodel: { type: 'formviewmodel' },
        tools: false,
        bind: { text: '{lastRequestDate}',}
   },
   { text: '+/-', flex: 1, dataIndex: 'fixVal', tools: false,}
];

Ext.define('TestFormApp.view.main.form.datagrid.FormDataGridView', {
	extend: 'Ext.grid.Grid',
  requires: [ 'Ext.data.TreeStore','Ext.grid.plugin.CellEditing'],
  xtype: 'formdatagridview',
  id: 'formdatagridview',
  viewmodel: { type: 'formviewmodel' },
  controller: 'formviewcontroller',
  height: 260,
  cls: 'formdatagridview',
  itemCls: 'formdatagridrowview',
	columnLines: true,
	sortable: false,
	sizeble: false,
	columnResize: false,
	columnMenu: false,
	loadingHeight: 10,
  showAnimation: true,
  required: true,
  formBind: true,
  selectable: false,
  bind: { store: '{storeDataGrid}' },
  columns: formDataGridColumns,
	selModel: 'cellmodel',
  itemConfig: {
    viewModel: true
  },
	plugins: {cellediting: true},
  listeners: [
    { beforeedit : 'onGridCellEdit' },
    { complete:  'onChangeGridData' },
    { updatedata : 'onChangeGridData' }
  ],
  rowClass: 'formdatagridview-row-gray',
  itemConfig: { xtype: 'gridrow' },
});
