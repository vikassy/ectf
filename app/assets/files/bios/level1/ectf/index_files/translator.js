define('translator', [
	'module/translator',
	'config',
	'module/translations/news',
	'module/translations/hausa',
	'module/translations/indonesia',
	'module/translations/russian'
], function(
	Translator,
	config,
	english,
	hausa,
	indonesia,
	russian
) {
	// when the desktop site has a path mapped for 'translation',
	// we can simplify this module by ripping out all of the
	// translation dependencies above, to how this module looked
	// before this commit.

	var translations = {
		'hausa': hausa,
		'indonesia': indonesia,
		'russian': russian
	};

	return new Translator(translations[config.service] || english, config.service);
});