Ext.define('TestFormApp.Application', {
	extend: 'Ext.app.Application',
	name: 'TestFormApp',
	requires: ['TestFormApp.*'],
	defaultToken: 'homeview',
	removeSplash: function () {
		//Ext.getBody().removeCls('launching')
		//var elem = document.getElementById("app-splash")
		//elem.parentNode.removeChild(elem)
	},
	launch: function () {
		this.removeSplash();
		var whichView = 'mainview';
		Ext.Viewport.add([{xtype: whichView}]);
	},

	onAppUpdate: function () {
		Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
			function (choice) {
				if (choice === 'yes') {
					window.location.reload();
				}
			}
		);
	}
});
