const _fetchMainData_url = 'http://localhost:5001/moora-testing-functions/us-central1/api/';

const isReqiredNumber = (value) => {
	switch (true) {
		case isNaN(value): return false;
		case Number(value) <= 0: return false;
		default: return true;
	}
};

/* Date processing actions */
const monthNames = ( monthNumber, inflect=true ) => {
	const names = [
		"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
		"Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
	];
	const namesInf = [
		"Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
		"Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
	];
	if (inflect) return namesInf[monthNumber];
	return names[monthNumber];
};

/* Return formated date: day & month name */
const getDayAndMonthName = ( date, inflect = true ) => {
	let prepDate = date || new Date;
	return prepDate.getDate() + ' ' + monthNames(prepDate.getMonth());
};

/* Return formated date: dd.mm.yy mm:ss */
const getFullDateTime = ( date, timeOff ) => {
	const prepDate = date || new Date();
		var dd = prepDate.getDate();
		if (dd < 10) dd = '0' + dd;
		var mm = prepDate.getMonth() + 1;
		if (mm < 10) mm = '0' + mm;
		var yy = prepDate.getFullYear();
		if (yy < 10) yy = '0' + yy;
		var prepTime = !timeOff ? ' '+[prepDate.getHours(), prepDate.getMinutes(), prepDate.getSeconds()]
			.map( x => x < 10 ? "0" + x : x ).join(":") : '';
		return dd + '.' + mm + '.' + yy + prepTime;
};

/* Define global util */
Ext.define('TestFormApp.util.MainUtils', {
  /* Main props */
	alternateClassName: ['MainUtils'],
	singleton: true,

  /* urls */
  _fetchInitialiseData_url: _fetchMainData_url+'get-initial-form-data',
  _fetchProcessedData_url: _fetchMainData_url+'get-processed-form-data',

	/* Fetch data */
  fetchRequest: async function (postData)   {
    const responseData = await fetch(
      this._fetchProcessedData_url, {
        method: 'POST',
				body: JSON.stringify( postData ),
  			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
        }
	    }
  	);
    return responseData;
  },

  /* Fetch data process */
  fetchProcessedData: function () {
    const formView = Ext.getCmp('formview');
		const reasonsCmp = Ext.getCmp('formreasonslistview');
    const reasonValue = reasonsCmp.getValue();
  	const gridRecords = Ext.getStore('storedatagrid').getRange();
    const keys = ['qZh', 'wPr', 'qH', 'nD', 'rLin', 'rBuf', 'rZat'];
    const composedData = gridRecords.map( (item, idx) => ({ [keys[idx]] : item.data.agreeProps }) );
		const viewModel = formView.getViewModel();
		const dataProcessing = (isTrue) => {
			isTrue ? viewModel.set({ maskActiveType: 'processing-data' }) : viewModel.set({ maskActiveType: null });
		};
		const todayFullFormat = getFullDateTime( new Date(), false);
    composedData.push({ reasonsForRejec : reasonValue });
		composedData.push({ newRequestDate: todayFullFormat });
    dataProcessing(true);
  	this.fetchRequest(composedData)
      .then( response => response.json() )
			  .then( (data) => {
					this.assignStoresAndValues(data, true);
					this.setLastRequestDateToColumnName( data );
					this.setRecoveryActivity(data);
					this.setStatusPanelAlertState();
					this.setProcessedValuesToGrid();
					this.setValidStatesToFields();
					reasonsCmp.setDisabled(true);
					dataProcessing( false );
				}).catch(err => { dataProcessing(false) } );
  },

  setValidStatesToFields: function () {
		const gridCmp = Ext.getCmp('formdatagridview');
		const gridRecords = gridCmp.getStore().getRange();
		const qZhRowNameEl = gridCmp.getViewItems()[0].cells[0].element.dom.children[0];
		const pWtRowNameEl = gridCmp.getViewItems()[1].cells[0].element.dom.children[0];
    gridRecords[0].data.valid ? qZhRowNameEl.style.color = 'green' : qZhRowNameEl.style.color = 'red';
    gridRecords[1].data.valid ? pWtRowNameEl.style.color = 'green' : pWtRowNameEl.style.color = 'red';
    qZhRowNameEl.setAttribute('data-qtip', gridRecords[0].data.valid ? 'Принято!' : 'Отклонено!');
    pWtRowNameEl.setAttribute('data-qtip', gridRecords[1].data.valid ? 'Принято!' : 'Отклонено!');
	},

  /* Initialise actions */
  setFormElementsInitialStates: function () {
    const formView = Ext.getCmp('formview');
		const viewModel = formView.getViewModel();
		const allDataStore = Ext.getStore('storeformalldata');
    const stringStore = Ext.getStore('storedatagrid');
    const reasonsSelectedRecord = Ext.getStore('storereasonsdata').findRecord( 'select', true );
    const reasonsActiveName = reasonsSelectedRecord ? reasonsSelectedRecord.get('reason') : '';
    const lastRequestDate = allDataStore.getRange()[0].get('lastRequestDate').value;
		const recoveryActivity = allDataStore.getRange()[0].get('recoveryActivity').value;
    viewModel.set({
			dataProcessing: false,
			maskActiveType: false,
			processMaskText: 'Обработка данных ...',
      recoveryActivity: recoveryActivity,
			lastRequestDate: lastRequestDate ? lastRequestDate : 'Запрошено',
			reasonsActiveName: reasonsActiveName,
		});
  },

  /* Assign stores */
	assignStoresAndValues: function ( data, assignAllDataSore ) {
		if (assignAllDataSore) Ext.getStore('storeformalldata').loadRawData(data);
		Ext.getStore('storedatagrid').loadRawData(data);
		Ext.getStore('storereasonsdata').loadRawData(data);
		this.setProcessedValuesToGrid();
	},

	/* Process & calculate some values in grid */
	setProcessedValuesToGrid: function () {
		const store = Ext.getStore('storedatagrid');
		const records = store.getRange();
		const qZh = store.getAt(0).data.agreeProps;
		const wPr = store.getAt(1).data.agreeProps;
	  if (isReqiredNumber(qZh) && isReqiredNumber(wPr)) {
			store.getAt(2).set( 'agreeProps', (Number(qZh)*(1-Number(wPr)/100)).toFixed(4) );
		};
		for (let i=0; i<records.length; i++) {
			const agreeProps = records[i].get('agreeProps');
			const previousProps = records[i].get('previousProps');
			if (agreeProps && previousProps) {
			  let fixVal = previousProps ? Number(agreeProps) - Number(previousProps) : '';
			  isNaN(fixVal) || fixVal == 0 ? fixVal='' : fixVal = fixVal.toFixed(4);
		    records[i].set( 'fixVal', fixVal );
			};
		};
	},

	/* Set red flash bground animation to required dom elements */
  setFlashBgroundToElements: function (elements) {
    for (let i=0; i<elements.length; i++) {
			elements[i].classList.remove('warning-flash');
			void elements[i].offsetWidth;
			elements[i].classList.add('warning-flash');
		};
	},

	/* Status panel state */
	setStatusPanelAlertState:  function ( active = true ) {
		const statusLabel = Ext.getCmp('formstatuslabel');
		const statusPanel = Ext.getCmp('formsendbuttonpanel');
		if (active) {
			const date = Ext.getStore('storeformalldata').getAt(0).data.newRequestDate.value;
			const alertText = 'Запрос на согласование отправлен ' + date;
			statusLabel.setHtml(alertText);
			statusPanel.setBodyCls('soft-color-background');
		} else {
			statusLabel.setHtml('');
			statusPanel.setBodyCls('');
		}
	},

	/* Set lastRequestDate value to column "lastRequestDate" */
	setLastRequestDateToColumnName: function ( data ) {
		const lastRequestDate = data ? data.lastRequestDate.value :
		  Ext.getStore('storeformalldata').getAt(0).data.lastRequestDate.value;
		if (Date.parse(lastRequestDate) !== NaN)
		  Ext.getCmp('formview').getViewModel().set({ lastRequestDate: lastRequestDate });
	},

 /* Set recoveryActivity value to textarea "Мероприятия по возврату..." */
	setRecoveryActivity: function ( data ) {
	  const recoveryActivity =  data ? data.recoveryActivity.value :
		  Ext.getStore('storeformalldata').getAt(0).data.recoveryActivity.value;
	  Ext.getCmp('formview').getViewModel().set({ recoveryActivity:  recoveryActivity});
	},

	/* Check required form items: "Причины отклонения", "Qж", "% воды" */
	checkRequiredItems: function () {
		const formCmp = Ext.getCmp('formview');
		const reasonsCmp = Ext.getCmp('formreasonslistview');
		const gridCmp = Ext.getCmp('formdatagridview');
		const reasonValue = reasonsCmp.getInputValue();
		const qZhValue = gridCmp.getViewItems()[0].cells[1].getValue();
		const pWtValue = gridCmp.getViewItems()[1].cells[1].getValue();
    const collectEls = [];
		if (!reasonValue) collectEls.push(Ext.query('#formreasonslistview .x-input-el')[0]);
		if (!qZhValue) collectEls.push(gridCmp.getViewItems()[0].cells[1].element.dom);
		if (!pWtValue) collectEls.push(gridCmp.getViewItems()[1].cells[1].element.dom);
    if (collectEls.length > 0) {
		  formCmp.getViewModel().set({ maskActiveType: 'missing-form-data' });
			setTimeout(()=> {
				formCmp.getViewModel().set({ maskActiveType: null });
				this.setFlashBgroundToElements(collectEls);
		  }, 2000);
	  	return false;
	  };
		return true;
	},

  /* Prepare actual form mask type */
	getFormMaskHtml: function (type)  {
		switch (true) {
			case type == 'initialise-data':
			  return '<div class="alert-ico-logo"></div><div class="info-text">Загрузка данных...</div><div class="loading-indicator"><div /></div>';
			case type == 'processing-data':
				return '<div class="alert-ico-logo"></div><div class="info-text">Обработка данных...</div><div class="loading-indicator"><div /></div>';
			case type == 'missing-form-data':
				return '<div class="alert-ico"></div><div class="info-text">Поля "Причины отклонения", "Qж" и "% воды" <br />должны быть заполнены!</div>';
			case type == 'fetch-data-error':
				return '<div class="alert-ico-fetch-error"></div><div class="info-text">Ошибка обработки данных...</div>';
			default:
				return '<div class="alert-ico-logo"></div><div class="info-text">Ожидайте...</div><div class="loading-indicator"><div /></div>';
		};
	},

	getDayAndMonthName,

});
