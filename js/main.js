/* main UI javascript for Pack Pack app */


// Create javascript backend
var app = new PackPack.App("menlocaleb");
var currentView = "#homepage";


function init() {
	$("#list").hide();
	$("#grouppage").hide();
}


function showView( pageId ) {
	$(pageId).toggle();			// show new page
	$(currentView).toggle();	// hide current page
	currentView = pageId;		// update current page
}



function populateLists( containerId ) {
	var container = $(containerId);
	container.empty(); // clear container
	var lists = app.getLists();
	for (var i = 0; i < lists.length; i++) {
		var html = '<li id="list-' + i + '" class="list-object" '+ ((i == lists.length-1) ? 'style="border:none"' : '') + '><a href="#" >' + lists[i].name + '<span>></span></a></li>';
		$(containerId).append(html);
		$(containerId).children().last().click( showPage("list", { 'name' : lists[i].name}));
	}

	// attach click handlers
	//$(".list-object").click(showPage("list", { name: })
	
} 


function goToListPage( listName ) {
	//populateListView(listName);
	showView("#list");
	console.log(listName);
}


function showPage( page, args ) {
	// return function so it stores arguments in closure for callbacks
	return function() {
		//console.log(page);
		//console.log(args);

		switch (page) {
			case "list":
				goToListPage(args.name);
				break;
			default:
				alert("error");
		}
	};	
}














$(document).ready(function() {
	init();
	app.createStuff();
	populateLists("#list-names");


});