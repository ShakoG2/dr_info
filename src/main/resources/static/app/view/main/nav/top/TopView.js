Ext.define('dr.view.main.nav.top.TopView', {
	extend: 'Ext.toolbar.Toolbar',
	//cls: 'topview',
	layout: {
		type: 'hbox',
	},
	border: false,
	padding: 0,
	height: 40,
	title: 'ტოპ ბარი',

	viewModel: true,

	// items: ['->', {
	// 	xtype: 'button',
	// 	iconCls: 'fa fa-user-circle',
	// 	iconAlign: 'right',
	// 	// bind: {
	// 	// 	text: '{user.firstName} {user.lastName}'
	// 	// },
	// 	menu: [
	// 	// 		{
	// 	// 	text: 'პროფილის რედაქტირება',
	// 	// 	iconCls: 'fa fa-user-circle',
	// 	// 	handler: 'openProfile'
	// 	// }, '-', {
	// 	// 	text: 'პაროლის შეცვლა',
	// 	// 	iconCls: 'fas fa-lock',
	// 	// 	handler: 'openPasswordChange'
	// 	// }, '-', {
	// 	// 	xtype: 'combo',
	// 	// 	fieldLabel: 'თემა',
	// 	// 	labelAlign: 'left',
	// 	// 	labelWidth: 60,
	// 	// 	store: [/*'aria',*/ 'classic', 'gray', 'crisp', 'neptune'/*, 'neptune-touch', 'triton'*/],
	// 	// 	editable: false,
	// 	// 	// value: theme,
	// 	// 	value: 'crisp',
	// 	// 	iconCls: 'fa fa-paint-brush',
	// 	// 	listeners: {
	// 	// 		change: 'changeTheme'
	// 	// 	}
	// 	// }, '-', {
	// 	// 	text: 'პროგრამის შესახებ',
	// 	// 	iconCls: 'fas fa-info-circle',
	// 	// 	handler: 'openAboutWindow'
	// 	// },
	// 		{
	// 		text: 'გამოსვლა',
	// 		iconCls: 'fas fa-sign-out-alt',
	// 		//handler: Util.logout
	// 	}]
	// }]
});