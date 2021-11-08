window.dr = window.dr || {}

Ext.Ajax.on({
	beforerequest: function (conn, request) {
		request.url = request.url.replace('//', '/');
	},

	requestexception: function (req, resp, options) {
		if (resp.timedout) {
			Ext.Msg.alert('შეცდომა', resp.statusText);
		} else if (resp.status === 401) {
			if (!dr.loginWindow) {
				dr.loginWindow = Ext.create('dr.view.login.Login');
			}
		} else if (resp.status === 403) {
			//process403Error(options);
		} else if (resp.status === 503) {

		} else {
			try {
				if (options.alert !== false) {
					let error = Ext.decode(resp.responseText);
					Ext.Msg.alert('შეცდომა', error.message);
				}
			} catch (e) {
				console.warn(resp.responseText);
			}
		}
	},

	requestcomplete: function (conn, resp) {
	}
});

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

