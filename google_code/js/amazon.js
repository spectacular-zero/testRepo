document.addEventListener('DOMContentLoaded', function () {
	let jsPath = 'js/inject.js';
	let tmp = document.createElement('script');
	tmp.src = chrome.extension.getURL(jsPath);
	tmp.setAttribute('type','text/javaScript');
	document.head.appendChild(tmp);
})