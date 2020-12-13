const reasonsListInput = Ext.create( 'Ext.field.Input', {
	xtype: 'reasonslistinputview',
	id: 'reasonslistinputview',
})


Ext.define('TestFormApp.view.main.form.reasonslist.FormReasonsListView', {
	extend: 'Ext.field.ComboBox',
	xtype: 'formreasonslistview',
	controller: 'formviewcontroller',
	viewmodel: { type: 'formviewmodel' },
  queryMode: 'local',
	id: 'formreasonslistview',
  instanceCls: 'formreasonslistview',
  itemCls: 'formreasonslistview-item',
	labelCls: 'formreasonslistview-label',
	inputCls: 'formreasonslistview-input',
  label: 'Причина отклонения',
  labelAlign: 'top',
  autoSelect:true,
  editable: false,
  displayField: 'reason',
  forceSelection: true,
	autoSelect: true,
	input: reasonsListInput,
  bind : {
    store: '{storeReasonsData}',
		inputValue: '{reasonsActiveName}',
  },
	listeners: {
    select: 'onSelectReasonsItem',
	},
	required: true,
	/* Error message props */
	msgTarget: 'under',
  validationMessage: 'This should not be blank!'
});
