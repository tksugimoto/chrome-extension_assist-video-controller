Promise.resolve(document.getElementsByTagName('video')).then(videos => {
	const targetVideoSrc = window.targetVideoSrc;
	if (typeof targetVideoSrc !== 'undefined') {
		const targetVideos = Array.from(videos).filter(video => {
			if (video.src === targetVideoSrc) return true;
			return Array.from(video.getElementsByTagName('source')).find(source => {
				return source.src === targetVideoSrc;
			});
		});
		return {videos, targetVideos};
	} else {
		return {videos, targetVideos: videos};
	}
}).then(({videos, targetVideos}) => {
	if (targetVideos.length === 1) return {videos, targetVideo: targetVideos[0]};
	if (targetVideos.length === 0) throw '対象<video>が存在しない';
	throw '対象<video>が複数存在';
}).then(({videos, targetVideo}) => {
	const video = targetVideo;

	// プレイヤーをクリックで再生/一時停止
	let nowPlaying = true;
	video.addEventListener('play', () => {
		nowPlaying = true;
	});
	video.addEventListener('pause', () => {
		nowPlaying = false;
	});
	const playPause = () => {
		if (nowPlaying) {
			video.pause();
		} else {
			video.play();
		}
	};
	video.addEventListener('click', playPause);


	// ホイールで音量変更
	// 下から40pxの領域ではシークする
	const seekAreaHeight = 40;
	const changeVolume = diff => {
		// volume: [0, 1]
		let vol = video.volume;
		vol += diff;
		vol = Math.min(vol, 1);
		vol = Math.max(vol, 0);
		video.volume = vol;
	};
	const seek = diff => {
		video.currentTime += diff;
	};
	video.addEventListener('wheel', evt => {
		evt.preventDefault();
		// 下方向へのスクロール: 正
		const toBottom = evt.deltaY > 0;
		const pxFromBottom = video.clientHeight - evt.offsetY;
		if (pxFromBottom < seekAreaHeight) {
			seek(5 * (toBottom ? 1 : -1));
		} else {
			changeVolume(0.1 * (toBottom ? -1 : 1));
		}
	});

	// ダブルクリックで最大化/最大化解除
	const isFullScreen = () => document.webkitIsFullScreen;
	const requestFullScreen = elem => elem.webkitRequestFullScreen();
	const cancelFullScreen = () => document.webkitCancelFullScreen();
	const toggleFullScreen = () => {
		// TODO: ダブルクリック時に一時停止・再生がされないようにする
		// 		（clickイベントの中でsetTimeoutを使ってうまくやる）
		if (isFullScreen()) {
			cancelFullScreen();
		} else {
			requestFullScreen(video);
		}
	};
	video.addEventListener('dblclick', toggleFullScreen);
	const WHEEL_BUTTON = 1;
	video.addEventListener('mouseup', evt => {
		if (evt.button === WHEEL_BUTTON) toggleFullScreen();
	});

	if (videos.length === 1) {
		// キーボードショートカット
		const shortcutFunctions = {};
		shortcutFunctions[' '] = playPause;
		shortcutFunctions['Enter'] = toggleFullScreen;
		shortcutFunctions['ArrowUp'] = () => changeVolume(0.1);
		shortcutFunctions['ArrowDown'] = () => changeVolume(-0.1);
		shortcutFunctions['ArrowRight'] = ({ctrl} = {}) => seek(ctrl ? 90 : 5);
		shortcutFunctions['ArrowLeft'] = ({ctrl} = {}) => seek(ctrl ? -90 : -5);
		document.body.addEventListener('keydown', evt => {
			const tagName = evt.target.tagName;
			if (tagName === 'TEXTAREA' || tagName === 'INPUT') return;
			const fn = shortcutFunctions[evt.key];
			if (fn) {
				evt.preventDefault();
				fn({
					ctrl: evt.ctrlKey,
				});
			}
		});
	}
});
