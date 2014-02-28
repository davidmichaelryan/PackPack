/* main UI javascript for Pack Pack app */


// Create javascript backend
var app = new PackPack.App("menlocaleb");
var currentView = "#homepage";


function init() {
	$("#list").hide();
	$("#grouppage").hide();

	$("#app-title").click(function() {
		// This should be working, but I'm not sure why it isn't?
		//showPage("home");
		goToHomePage();
	});

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
	$("#groups > .list-header > .plus").click( showPage("groups"));
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

	// add help text if no items in list currently
	if (items.length === 0) {
		container.append("<p>No items are currently in this list. <br /> Please tap the plus sign to add an item.</p>");
	}
}

function populateGroups() {
	var groupsContainer = $("#groups > .list").first();
	// clear containers
	groupsContainer.empty();

	var groups = app.getJoinedGroups();
	for (var i = 0; i < groups.length; i++) {
		var html = '<li id="group-' + i + '" class="list-object"><a href="#">' + groups[i].name + '</a></li>';
		groupsContainer.append(html);
		groupsContainer.children().last().click( showPage("group-page", { 'name' : groups[i].name}));
	}

}

function populateGroupsView() {
	var myGroupsContainer = $("#grouppage > .list").first();
	var otherGroupsContainer = $("#grouppage > .list").last();
	// clear containers
	myGroupsContainer.empty();
	otherGroupsContainer.empty(); 

	var groups = app.getGroups();
	for (var i = 0; i < groups.length; i++) {
		var html = '<li id="group-' + i + '" class="list-object"><a href="#">' + groups[i].name + '</a><span class="group-membership ' + ((groups[i].isMember()) ? 'member">Leave' : 'notMember">Join') + '</span></li>';
		
		if (groups[i].isMember()) {
			myGroupsContainer.append(html);
			myGroupsContainer.children().last().click( showPage("group-page", { 'name' : groups[i].name}));
			myGroupsContainer.children().last().find(".group-membership").click( leaveGroup(i));
		} else {
			otherGroupsContainer.append(html);
			otherGroupsContainer.children().last().click( showPage("group-page", { 'name' : groups[i].name}));
			otherGroupsContainer.children().last().find(".group-membership").click( joinGroup(i))
		}
		
	}

}

function leaveGroup( index ) {
	return function() {
		app.leaveGroup(index);
		populateGroupsView();
	}
}

function joinGroup( index ) {
	return function() {
		app.joinGroup(index);
		populateGroupsView();
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
			case "group-page":
				console.log(args.name);
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