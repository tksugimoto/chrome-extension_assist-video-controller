'use strict';

const CONTEXT_MENU_ID = 'a';

const createContextMenu = () => {
	chrome.contextMenus.create({
		title: 'Videoコントローラー補助',
		contexts: ['video'],
		documentUrlPatterns: [
			'http://*/*',
			'https://*/*',
		],
		id: CONTEXT_MENU_ID,
	});
};

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === CONTEXT_MENU_ID) {
		chrome.tabs.executeScript(tab.id, {
			frameId: info.frameId,
			code: `window.targetVideoSrc = '${info.srcUrl}';`,
		}, () => {
			chrome.tabs.executeScript(tab.id, {
				frameId: info.frameId,
				file: 'VideoPlayerController.js',
			});
		});
	}
});
