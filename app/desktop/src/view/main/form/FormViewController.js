Ext.define('TestFormApp.view.main.form.FormViewController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.formviewcontroller',
	viewModel: { type: 'formviewmodel'},
	requires: ['MainStore', 'MainUtils'],
	id: 'formviewcontroller',
	reference: 'formviewcontroller',
  /* Form grid handlers */
	onGridCellEdit: (a, b) => b.recordIndex !== 2,
	onUpdateGridData: function () {
		MainUtils.setProcessedValuesToGrid();
	},
	onChangeGridData: () => {
     MainUtils.setProcessedValuesToGrid();
	},
  /* Form main handlers */
	onSendData: () => {},
	onClickFormSizeButton: function() {
		const maximized = this.getViewModel().data.formMaximized;
	  this.getViewModel().setData({ formMaximized: !maximized });
	},
	onClickCloseButton: function () {
		const mainForm = Ext.getCmp('formview');
		const hidden = mainForm.getHidden();
		if (!hidden) mainForm.hide();
	},
	onStartDataProcessing: function () {
    this.getViewModel().setData({ dataProcessing: true });
	},
	onEndDataProcessing: function () {
		this.getViewModel().setData({ dataProcessing: false });
	},
	onMainDataLoaded: function(a, b) {
		gridDataStore.loadRawData(b[0].data);
		reasonsDataStore.loadRawData(b[0].data);
		recoveryActivity.loadRawData(b[0].data);
    onEndDataProcessing();
	},
	onSelectReasonsItem: function (target, newVal, oldVal) {
    const store = Ext.getStore('storereasonsdata');
		const recCount = store.count();
    for (let i=0; i<recCount; i++) {
			const rec = store.getAt(i);
			rec.get('reason') == newVal.get('reason') ?
			  rec.set({ select: true }) : rec.set({ select: false });
		};
	},
	setStatusPanelAlertStyle: function () {},
	onSubmitForm: () => {
		if (MainUtils.checkRequiredItems())
		  MainUtils.fetchProcessedData();
	},
	onReadyForm: () => Ext.getStore('storeformalldata').load(),

});
