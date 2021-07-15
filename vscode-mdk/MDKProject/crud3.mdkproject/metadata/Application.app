{
	"_Name": "bookshop-mdk",
	"Version": "/bookshop-mdk/Globals/AppDefinition_Version.global",
	"MainPage": "/bookshop-mdk/Pages/Overview.page",
	"OnLaunch": [
		"/bookshop-mdk/Actions/Service/Initialize.action"
	],
	"OnWillUpdate": "/bookshop-mdk/Rules/OnWillUpdate.js",
	"OnDidUpdate": "/bookshop-mdk/Actions/Service/Initialize.action",
	"Styles": "/bookshop-mdk/Styles/Styles.less",
	"Localization": "/bookshop-mdk/i18n/i18n.properties"
}