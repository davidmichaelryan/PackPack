/* Javascript to populate DOM based on PackPack library */
// <li class="list-object"><a href="#">A test list item <span>></span></a></li>

var app = new PackPack.App("menlocaleb");


function populateLists( containerId ) {
	var container = $(containerId);
	container.empty(); // clear container
	var lists = app.getLists();
	for (var i = 0; i < lists.length; i++) {
		var html = '<li id="list-' + i + '" class="list-object"' + ((i == lists.length-1) ? 'style="border:none"' : '') + '><a href="#">' + lists[i].name + '<span>></span></a></li>';
		$(containerId).append(html);
	}
	
} 

function removeList() {
	app.deleteList("School Supplies");
	$("#list-0").remove();
	
}

function addList() {
	app.addList("New Stuff");
	populateLists("#list-names");
}

function renameList() {
	app.changeListName("Dorm Room Stuff", "Dorm Things");
	populateLists("#list-names");
}



$(document).ready(function() {
	app.createStuff();
	populateLists("#list-names");


});