window.dr = window.dr || {}

Ext.Ajax.on('requestexception', function (conn, response, options, eOpts) {
	switch (response.status) {
		case 302 : {
			alert("302");
			window.open("/login");
			break;
		}
		case 400 : {
			Ext.Msg.alert('შეცდომა', 'მონაცემების შენახვის შეცდომა - ' + ' ' + 'status: ' + response.status);
			break;
		}
		case 403 : {
			process403Error(options);
			break;
		}
		case 401 : {
			if (!dr.loginWindow) {
				dr.loginWindow = Ext.create('dr.view.login.Login');
			}
			break;
		}
		case 500 : {
			let errMsg = '';
			debugger
			if (response.responseJson) errMsg = response.responseJson.message;
			else errMsg = JSON.parse(response.responseText).message;
			Ext.Msg.alert('შეცდომა', errMsg + ' ' + 'status: ' + response.status);
			break;
		}
	}
}, this);

Ext.application({
	name: 'dr',
	appFolder: 'app',
	requires: [
		'dr.view.main.MainView',
		'dr.view.login.Login',
	],
	launch: function () {
		// Ext.ariaWarn = Ext.emptyFn;
		// Ext.getBody().removeCls('launching');
		// Ext.get('splash').destroy();

		Ext.Ajax.request({
			url: 'users/myself',
			method: 'GET',
			success: function (user) {
				dr.user = user;
				let loadClass = 'dr.view.main.MainView';
				if (user) {
					debugger
					Ext.create('Ext.container.Viewport', {
						// controller: {
						// 	xclass: 'LE.view.AppController'
						// },
						//viewModel: le.mainViewModel,
						layout: 'fit',
						items: [{
							xclass: 'dr.view.main.MainView',
							reference: 'mainPanel'
						}]
					});
				} else {
					Ext.Viewport.add([{xclass: loadClass}]);
				}
			}
		});
	}
});

