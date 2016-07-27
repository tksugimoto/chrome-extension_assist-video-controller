const videos = document.getElementsByTagName("video");
if (videos.length === 1) {
	const video = videos[0];

	// プレイヤーをクリックで再生/一時停止
	let nowPlaying = true;
	video.addEventListener("play", () => {
		nowPlaying = true;
	});
	video.addEventListener("pause", () => {
		nowPlaying = false;
	});
	video.addEventListener("click", evt => {
		if (nowPlaying) {
			video.pause();
		} else {
			video.play();
		}
	});

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
	video.addEventListener("wheel", evt => {
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
	video.addEventListener("dblclick", evt => {
		// TODO: ダブルクリック時に一時停止・再生がされないようにする
		// 		（clickイベントの中でsetTimeoutを使ってうまくやる）
		if (isFullScreen()) {
			cancelFullScreen();
		} else {
			requestFullScreen(video);
		}
	});
}
