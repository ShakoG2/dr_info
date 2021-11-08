(function () {
	var pluginName = 'templatetable';
	CKEDITOR.plugins.add(pluginName, {
		icons: 'templatetable',
		init: function (editor) {
			editor.addCommand(pluginName, {
				exec: function () {
					editor.insertHtml('<table class="templatetable-data-table" style="width: 100%;" datasource="" border="1" cellpadding="1" cellspacing="1" >' +
						'<thead><tr><th>header 1</th><th>header 2</th><th>header 3</th></tr></thead>' +
						'<tbody><tr class="templatetable-copy-row"><td></td><td></td><td></td></tr></tbody>' +
						'</table>', 'unfiltered_html');
				}
			});

			editor.ui.addButton && editor.ui.addButton(pluginName, {
				label: 'შაბლონი ცხრილის დამატება',
				command: pluginName
			});
		}
	});
})();