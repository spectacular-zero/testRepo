//导出的数据
var exportData = [];
var st = "测试";

function getData() {
	console.log('导出前');
	//用户名源数据
	var userNames = document.getElementsByClassName("a-profile-name");
	//评价内容的父标签
	var contents = document.getElementsByClassName("a-size-base review-text review-text-content");
	//评分集合
	var scores = document.querySelectorAll('[data-hook="review-star-rating"]');
	//评论日期源数据
	var dates = document.getElementsByClassName("a-size-base a-color-secondary review-date");
	//评论内容集合
	var tempContents = [];
	for(var i=0; i<contents.length; i++) {
		tempContents[i] = contents[i].getElementsByTagName("span")[0].innerHTML;
	}
	//用户名集合，临时用set集合，去除重合的数据
	let tempUserNames = new Set();
	for(var i=2; i<userNames.length; i++) {
		tempUserNames.add(userNames[i].innerHTML);
	}
	//日期集合
	let tempDates = [];
	for(var i=2; i<dates.length; i++) {
		tempDates[i-2] = dates[i].innerHTML;
	}
	/**console.log(tempUserNames.size);
	console.log(contents.length);
	console.log(scores.length);
	console.log(tempDates.length);
	tempUserNames.forEach(function (element, sameElement, set) {  
		console.log(element);
	})
	**/
	let index = 0;
	//填入数据
	tempUserNames.forEach(function (element, sameElement, set) {  
		exportData.push({"userName": element, "content": tempContents[index], "score": scores[index].getElementsByTagName("span")[0].innerHTML, "date": tempDates[index]});
		index++;
	})
	console.log(exportData);
}

function sleep(ms){
   var start=Date.now(),end = start+ms;
   while(Date.now() < end);
   return;
}

/**
 * 导出excel
 * @param {Object} title  标题列key-val
 * @param {Object} data   值列key-val
 * @param {Object} fileName  文件名称
 */
function JSONToExcelConvertor(title, data, fileName) {
 var CSV = '';
 var row = "";

 for (var i = 0; i < title.length; i++) {
  if(title[i].title){
   row += title[i].title + ',';
  }
 }
 row = row.slice(0, -1);
 CSV += row + '\r\n';

 for (var i = 0; i < data.length; i++) {
  var row = "";
  for (var j = 0; j < title.length; j++) {
   if(title[j].title){
		console.log("111");
		row += '"' + (data[i][title[j].field] ? data[i][title[j].field] : "") + '"\t,';
   }
  }
  row.slice(0, row.length - 1);
  CSV += row + '\r\n';
 }

 if (CSV == '') {
  alert("Invalid data");
  return;
 }

 var fileName = fileName;
 var uri = new Blob(['\ufeff' + CSV], {type:"text/csv"});

 if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
  window.navigator.msSaveOrOpenBlob(CSV, fileName + ".csv");
 } else { // for Non-IE（chrome、firefox etc.）
  var link = document.createElement("a");
  link.href = URL.createObjectURL(uri);

  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 }
}


window.onload = (event) => {
	console.log('添加前');
	if(document.getElementById("zdyau") == null) {
		console.log('添加中');
		var sourceDom = document.getElementById("cm_cr-buy_box")
		var addDom = document.createElement("input")
		addDom.setAttribute("type", "button");
		addDom.setAttribute("class", "bg s_btn");
		addDom.setAttribute("value", "获取评论");
		addDom.setAttribute("align", "center");
		addDom.setAttribute("id", "zdyau");
		sourceDom.appendChild(addDom);
		document.getElementById("zdyau").onclick = function() {
			getData();
			document.getElementsByClassName("a-last")[0].getElementsByTagName("a")[0].click();
			//简单粗暴的处理，延迟3s，等待上一步的下一页操作
			setTimeout(function () {
				getData();
				//console.log(st);
				var title = [{title: "评论用户", field: "userName"}, {title: "评论内容", field: "content"}, {title: "评分", field: "score"}, {title: "评论日期", field: "date"}];
				var name = "contentCSV";
				console.log(name);
				JSONToExcelConvertor(title, exportData, name);
			}, 3000);
		}
		console.log('添加后');
	}
}
