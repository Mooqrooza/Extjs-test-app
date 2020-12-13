Ext.define('TestFormApp.view.main.form.FormViewModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.formviewmodel',
	id: 'formviewmodel',
	reference: 'formviewmodel',
	requires: ['MainUtils'],
	data: {
		/* Form layouts & states */
		formMaxWidth_value: '100%',
		formMaxHeight_value: '100%',
		formMinWidth_value: 600,
		formMinHeight_value: 400,
		formMaximized: false,
		formDisabled: true,
		dataProcessing: true,
		formHidden: true,
		/* Other */
		name: 'TestFormApp',
		formTitleText: `Согласование изменений параметров работы скважины ${MainUtils.getDayAndMonthName()}`,
		fieldAndWellName: '41 / Ичединское',
		lastRequestDate: '',
		lastProcessingDateOnServer: '',
		reasonsActiveName: '',
		recoveryActivity: '',
		maskActiveType: 'initialise-data',
		today: new Date(),
	},
	formulas: {
		/* Form layouts & states */
		form_width: get => get('formMaximized') ? get('formMaxWidth_value') : get('formMinWidth_value'),
		form_height: get => get('formMaximized') ? get('formMaxHeight_value') : get('formMinHeight_value'),
		/* Other */
		formMask: get => get('maskActiveType') ? { xtype: 'formmaskview',  html: MainUtils.getFormMaskHtml(get('maskActiveType')) } : false,
	},
  stores: {
		storeDataGrid: Ext.getStore('storedatagrid'),
		storeReasonsData: Ext.getStore('storereasonsdata'),
	},
});
