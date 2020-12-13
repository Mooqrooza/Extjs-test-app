Ext.define('TestFormApp.view.main.form.pivottextarea.FormPivotTextAreaView', {
	extend: 'Ext.field.TextArea',
	xtype: 'formpivottextareaview',
  reference: 'formpivottextareaview',
	viewmodel: { type: 'formviewmodel' },
	cls: 'formpivottextareaview',
  labelAlign: 'top',
  label: 'Мероприятия по возврату снижений',
	bind: { value: '{recoveryActivity}' },
	disabled: true,
});
