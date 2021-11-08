(function () {
	var pluginName = 'PDFPreview';
	CKEDITOR.plugins.add(pluginName, {
		icons: 'PDFPreview',
		init: function (editor) {
			editor.addCommand(pluginName, {
				exec: function () {
					editor.fire('pdfpreview');
				}
			});

			editor.ui.addButton && editor.ui.addButton('PDFPreview', {
				label: 'ნახვა',
				command: pluginName
			});
		}
	});
})();