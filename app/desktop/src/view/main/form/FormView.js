Ext.define('TestFormApp.view.main.form.FormView', {
    extend: 'Ext.form.Panel',
    xtype: 'formview',
    controller: 'formviewcontroller',
    viewModel: { type: 'formviewmodel' },
    id: 'formview',
    requires: ['Ext.Label'],
    layout: 'vbox',
    cls: 'formview',
    hidden: true,
    bind: {
      width: '{form_width}',
      minHeight: '{form_height}',
      masked: '{formMask}'
    },
    showAnimation: 'fade',
    hideAnimation: 'fadeOut',
    shadow: true,
    floating: true,
    tools: [
      { type: 'maximize',  handler: 'onClickFormSizeButton'  },
      { type: 'close', handler: 'onClickCloseButton'  },
    ],
    items: [
      { xtype: 'label', bind: { html: '{fieldAndWellName}' }, cls: 'formview-field-and-well-name', padding: '30px 10px 20px 0' },
      { xtype: 'formreasonslistview', reference: 'formreasonslistview' },
      { xtype: 'formdatagridview', reference: 'formdatagridview' },
      { xtype: 'formpivottextareaview', reference: 'formpivottextareaview' },
      { xtype: 'panel', id: 'formsendbuttonpanel', header: false,
        cls: 'formview-send-button-panel', layout: { type: 'hbox', align: 'center'}, bodyStyle: 'padding: 20px;',
        items: [
         { xtype: 'label', id: 'formstatuslabel', flex: 1, cls: 'formview-status-label' },
         { xtype: 'formsendbuttonview', reference: 'formsendbuttonview' },
        ]
      },
    ],
    title: {
      bind: { text: '{formTitleText}' },
		  style: 'font-size: 14px; font-weight: bold; ',
		},
    listeners: {
      painted: { element: 'element', fn: 'onReadyForm' },
    },
});
