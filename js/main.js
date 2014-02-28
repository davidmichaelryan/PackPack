/* main UI javascript for Pack Pack app */


// Create javascript backend
var app = new PackPack.App("menlocaleb");
var currentView = "#homepage";


function init() {
	$("#list").hide();
	$("#grouppage").hide();
	$("#lists > .list-header > .plus").click( function() {
		var addListModalContent = $('#add-list-modal');
		$('#modal').html(addListModalContent);
		$('#modal').dialog();
	});
	$("#budget > .list-header > .plus").click( function() {
		var addBudgetModalContent = $('#add-budget-modal');
		$('#modal').html(addBudgetModalContent);
		$('#modal').dialog();
	});
	$("#groups > .list-header > .plus").click( function() {
		var addGroupModalContent = $('#add-group-modal');
		$('#modal').html(addGroupModalContent);
		$('#modal').dialog();
	});
}


function showView( pageId ) {
	if (pageId !== currentView) {
		$(pageId).show();			// show new page
		$(currentView).hide();	// hide current page
		currentView = pageId;		// update current page
	}	
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
	
} 


function populateListView( listName ) {
	$("#list > .list-header > h2").html( listName );
	var container = $("#list > .list");
	container.empty(); // clear container
	var items = app.getList(listName).getItems();
	for (var i = 0; i < items.length; i++) {
		var html = '<li id="item-' + i + '" class="list-object"><a href="#">' + items[i].name + '</a><span class="item-status">' + items[i].getStatus() + '</span></li>';
		container.append(html);
		container.children().last().click( showPage("item", { 'name' : items[i].name}));
	}
}


function goToListPage( listName ) {
	populateListView(listName);
	showView("#list");
	console.log(listName);
}

function goToHomePage() {
	populateLists("#list-names");
	showView("#homepage");
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
			case "item":
				console.log(args.name);
				break;
			case "home":
				goToHomePage();
				break;
			default:
				alert("error");
		}
	};	
}








$(document).ready(function() {
	init();
	app.createStuff();
	goToHomePage();

});