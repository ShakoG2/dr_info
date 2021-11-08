Ext.define('dr.view.login.LoginController',{
	extend: 'Ext.app.ViewController',
	alias: 'controller.loginController',

	control: {
		'#': {
			afterrender: function (win) {
				let refs = this.getReferences();
				if (dr.user) {
					win.secondary = true;

					refs['username'].setValue(dr.user.username);
					refs['username'].setReadOnly(true);
					setTimeout(function () {
						refs['password'].focus();
					}, 100);

					refs['buttons'].insert(0, '->');
					refs['buttons'].insert(0, {
						text: 'სხვა მომხმარებელი',
						handler: 'changeUser'
					});
				} else {
					refs['username'].focus();
				}
			},
			close: function (view) {
				dr.loginWindow = null;
			}
		}
	},

	changeUser: function () {
		location.reload();
	},

	login: function () {
		let me = this;
		let win = me.getView();
		let form = me.lookup('form');
		if (!form.getForm().isValid()) return;
		let values = form.getForm().getValues();

		me.getView().setLoading(true);
		Ext.Ajax.request({
			url: 'login',
			params: values,
			method: 'POST',
			success: function () {
				if (win.secondary) {
					win.close();
				} else {
					location.reload();
				}
			},
			failure: function (response) {
				me.getView().setLoading(false);
				let msg;
				try {
					let responseObj = Ext.decode(response.responseText);
					msg = responseObj.message;
				} catch (e) {
					msg = 'მომხმარებლის სახელი ან პაროლი არასწორია';
				}
				Ext.Msg.alert('შეცდომა', msg);
			}
		});
	}
})