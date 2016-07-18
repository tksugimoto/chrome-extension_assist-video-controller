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
}
