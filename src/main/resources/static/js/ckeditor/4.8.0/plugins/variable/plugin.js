(function () {
	var pluginName = 'variable';
	// Register a plugin named "save".
	CKEDITOR.plugins.add(pluginName, {
		// jscs:disable maximumLineLength
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'var', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function (editor) {

			editor.addCommand(pluginName, {
				exec: function () {
					editor.fire('variable-click');
				}
			});
			// editor.ui.addButton && editor.ui.addButton('variable', {
			// 	label: editor.lang.variable.toolbar,
			// 	command: pluginName,
			// 	icon: 'var'
			// });
			// editor.removeMenuItem('paste');
			editor.addMenuGroup('variable', 3);
			editor.addMenuItems({
				pasteastext: {
					group: 'variable',
					icon: 'var',
					label: "Choos template or variable",
					command: 'variable',
					order: 0
				}
			});
			editor.contextMenu.addListener(function (element, selection) {
				return {pasteastext: CKEDITOR.TRISTATE_ON};
			});
		}
	});
})();