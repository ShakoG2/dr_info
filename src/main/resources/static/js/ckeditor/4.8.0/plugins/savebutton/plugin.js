(function () {
	var pluginName = 'savebutton';
	// Register a plugin named "save".
	CKEDITOR.plugins.add(pluginName, {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'save', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function (editor) {

			editor.addCommand(pluginName, {
				exec: function () {
					editor.fire('save');
				}
			});
			editor.ui.addButton && editor.ui.addButton('Save', {
				label: editor.lang.save.toolbar,
				command: pluginName
			});
		}
	});
})();