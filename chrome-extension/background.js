'use strict';

const CONTEXT_MENU_ID = 'a';

const createContextMenu = () => {
	chrome.contextMenus.create({
		title: 'Videoコントローラー補助',
		contexts: [
			'video',
			'page',
		],
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
		const injectScript = () => {
			chrome.scripting.executeScript({
				target: {
					tabId: tab.id,
					frameIds: [info.frameId],
				},
				files: ['VideoPlayerController.js'],
			});
		};
		if (!info.srcUrl) { // 'page' の場合 undefined
			injectScript();
			return;
		}
		chrome.scripting.executeScript({
			target: {
				tabId: tab.id,
				frameIds: [info.frameId],
			},
			func: (src) => window.targetVideoSrc = src,
			args: [info.srcUrl],
		}, injectScript);
	}
});
