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
	let changeVolume = diff => {
		// volume: [0, 1]
		let vol = video.volume;
		vol += diff;
		vol = Math.min(vol, 1);
		vol = Math.max(vol, 0);
		video.volume = vol;
	};
	video.addEventListener("wheel", evt => {
		// 下方向へのスクロール: 正
		let toBottom = evt.deltaY > 0;
		changeVolume(0.1 * (toBottom ? -1 : 1));
	});

	// ダブルクリックで最大化/最大化解除
	let isFullScreen = () => document.webkitIsFullScreen;
	let requestFullScreen = elem => elem.webkitRequestFullScreen();
	let cancelFullScreen = () => document.webkitCancelFullScreen();
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
