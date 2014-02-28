/* main UI javascript for Pack Pack app */


// Create javascript backend
var app = new PackPack.App("menlocaleb");
var currentView = "#homepage";


function init() {
	$("#list").hide();
	$("#grouppage").hide();
	$("#groups > .list-header > h2").click( showPage("groups"));
	$("#lists > .list-header > .plus").click( function() {
		$('#add-list-modal').dialog({
      		//autoOpen: false,
      		//height: 300,
      		//width: 350,
      		modal: true,
      		buttons: {
        		"Create list": function() {
        			var name = $("#list-name-modal").val();
        			try {
        				app.addList(name);
        				populateLists();
        				$( this ).dialog( "close" );
        			} catch (err) {
        				console.log(err.message);
        			}
          			
        		},
        		Cancel: function() {
          			$( this ).dialog( "close" );
        		}
      		},
      		close: function() {
        		$("#list-name-modal").val("");
      		}
    	});
	});
	$("#budget > .list-header > .plus").click( function() {
		$('#add-budget-modal').dialog();
	});
	$("#groups > .list-header > .plus").click( function() {
		$('#add-group-modal').dialog();
	});
	$("#list > .list-header > .plus").click( function() {
		$('#add-item-modal').dialog({
      		//autoOpen: false,
      		//height: 300,
      		//width: 350,
      		modal: true,
      		buttons: {
        		"Create item": function() {
        			var name = $("#item-name-modal").val();
        			var desc = $("#item-desc-modal").val();
        			var listName = $("#item-list-modal").val();
        			console.log(listName);
        			try {
        				app.addItemToList(name, desc, listName);
        				populateListView(listName);
        				$( this ).dialog( "close" );
        			} catch (err) {
        				console.log(err.message);
        			}
          			
        		},
        		Cancel: function() {
          			$( this ).dialog( "close" );
        		}
      		},
      		close: function() {
        		$("#item-name-modal").val("");
        		$("#item-desc-modal").val("");
      		}
    	});
	});
}


function showView( pageId ) {
	if (pageId !== currentView) {
		$(pageId).show();			// show new page
		$(currentView).hide();	// hide current page
		currentView = pageId;		// update current page
	}	
}



function populateLists() {
	var container = $("#list-names");
	container.empty(); // clear container
	var lists = app.getLists();
	for (var i = 0; i < lists.length; i++) {
		var html = '<li id="list-' + i + '" class="list-object" '+ ((i == lists.length-1) ? 'style="border:none"' : '') + '><a href="#" >' + lists[i].name + '<span>></span></a></li>';
		container.append(html);
		container.children().last().click( showPage("list", { 'name' : lists[i].name}));
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

	// update hidden field on add item modal
	$("#item-list-modal").val(listName);
}

function populateGroups() {

}

function populateGroupsView() {
	var myGroupsContainer = $("#grouppage > .list").first();
	var otherGroupsContainer = $("#grouppage > .list").last();
	// clear containers
	myGroupsContainer.empty();
	otherGroupsContainer.empty(); 

	var myGroups = app.getJoinedGroups();
	for (var i = 0; i < myGroups.length; i++) {
		var html = '<li id="group-' + i + '" class="list-object"><a href="#">' + myGroups[i].name + '</a></li>';
		myGroupsContainer.append(html);
		myGroupsContainer.children().last().click( showPage("group", { 'name' : myGroups[i].name}));
	}

	var otherGroups = app.getUnJoinedGroups();
	for (var i = 0; i < otherGroups.length; i++) {
		var html = '<li id="group-' + i + '" class="list-object"><a href="#">' + otherGroups[i].name + '</a></li>';
		otherGroupsContainer.append(html);
		otherGroupsContainer.children().last().click( showPage("group", { 'name' : otherGroups[i].name}));
	}
}

function goToListPage( listName ) {
	populateListView(listName);
	showView("#list");
}

function goToHomePage() {
	populateLists();
	populateGroups();
	showView("#homepage");
}

function goToGroupsPage() {
	populateGroupsView();
	showView("#grouppage");
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
			case "groups":
				goToGroupsPage();
				break;
			default:
				alert("error");
		}
	};	
}








$(document).ready(function() {
	init();
	app.createStuff();
	app.initListOfGroupsForProduction();
	goToHomePage();


});