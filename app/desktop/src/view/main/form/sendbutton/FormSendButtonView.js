Ext.define('TestFormApp.view.main.form.sendbutton.FormSendButtonView', {
	extend: 'Ext.Button',
	xtype: 'formsendbuttonview',
  reference: 'formsendbuttonview',
	viewModel: { type: 'formviewmodel' },
  text: 'Отправить',
  buttonType: 'submit',
  border: true,
  elementCls: 'formsendbuttonview',
  cls: 'form-send-button-view',
  listeners: {
		click: { element: 'element', fn: 'onSubmitForm'}
	}
});
