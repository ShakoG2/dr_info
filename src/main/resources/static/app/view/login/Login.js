Ext.define('dr.view.login.Login',{
	xtype: 'loginview',
	extend: 'Ext.window.Window',
	requires: 'dr.view.login.LoginController',
	controller: 'loginController',
	referenceHolder: true,
	modal: true,
	autoShow: true,
	onEsc: Ext.emptyFn,
	width: 300,
	resizable: false,
	draggable: false,
	title: 'ავტორიზაცია',
	layout: 'fit',
	closable: false,
	items: [{
		xtype: 'form',
		reference: 'form',
		bodyPadding: 10,
		border: false,
		fieldDefaults: {
			anchor: '100%',
			labelAlign: 'right',
			allowBlank: false,
			hideMandatorySign: true
		},
		items: [{
			xtype: 'textfield',
			name: 'username',
			reference: 'username',
			fieldLabel: 'მომხმარებელი',
		}, {
			xtype: 'textfield',
			name: 'password',
			reference: 'password',
			inputType: 'password',
			fieldLabel: 'პაროლი'
		}],
		buttons: {
			reference: 'buttons',
			items: [{
				text: 'შესვლა',
				handler: 'login',
				iconCls: 'fas fa-sign-in-alt',
				submitsForm: true
			}]
		}
	}]
})