"use strict";

var CONTEXT_MENU_ID = "a";

function createContextMenus() {
	chrome.contextMenus.create({
		title: "Videoコントローラー補助",
		contexts: ["video"],
		documentUrlPatterns: [
			"http://*/*",
			"https://*/*"
		],
		id: CONTEXT_MENU_ID
	});
}

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onStartup.addListener(createContextMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
	console.log(info, tab);
	if (info.menuItemId === CONTEXT_MENU_ID) {
		chrome.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `window.targetVideoSrc = "${info.srcUrl}";`
		}, () => {
			chrome.tabs.executeScript(tab.id, {
				frameId: info.frameId,
				file: "content_script.js"
			});
		});
	}
});
