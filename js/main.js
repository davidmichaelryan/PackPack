/* main UI javascript for Pack Pack app */


// Create javascript backend
var app = new PackPack.App("menlocaleb");
// store the current variable;
var currentView = "#homepage";

/* ********** Variables related to running interface as a test runner ******* */
var runTestRunner = false; // turn on or off test runner

// list of tasks for user to complete
var tasks = [
	{
		description: "First, imagine you are an incoming freshman beginning to brainstorm what you need for college. <b>Make a list called 'School Supplies'</b> and <b>add a 'Desk Lamp'</b> to that list. After you are finished <b>navigate back to the home screen.</b>",
		check: function() {
			var taskCompleted = false;
			try {
				var list = app.getList("School Supplies");
				for (var i = 0; i < list.getItems().length; i++) {
					taskCompleted = taskCompleted || (list.getItem(i).name === "Desk Lamp");
				}
			} catch (error) {
				console.log(error);
				return false;
			}

			taskCompleted = taskCompleted && (currentView === "#homepage");

			return taskCompleted;
		}
	},
	{
		description: "Now you want to see what other people are bringing to college. <b>Join a group for Elder Residential Hall</b>, and once you are done <b>return to the home page.</b>",
		check: function() {
			var taskCompleted = false;
			try {
				var groups = app.getJoinedGroups();
				for (var i = 0; i < groups.length; i++) {
					taskCompleted = taskCompleted || (groups[i].name === "Elder Residential Hall");
				}
			} catch (error) {
				console.log(error);
				return false;
			}

			taskCompleted = taskCompleted && (currentView === "#homepage");

			return taskCompleted;
		}
	},
	{
		description: "Finally, imagine you purchased and subsequently <b>packed an 'Eraser'</b>. <b>Update your School Supplies list</b> accordingly, then <b>return to the home page.</b>",
		check: function() {
			var taskCompleted = false;
			try {
				var list = app.getList("School Supplies");
				var items = list.getItems();
				// find item Eraser
				for (var i = 0; i < items.length; i++) {
					taskCompleted = taskCompleted || ((items[i].name === "Eraser") && (items[i].getStatus() === "packed"));
				}
			} catch (error) {
				console.log(error);
				return false;
			}

			taskCompleted = taskCompleted && (currentView === "#homepage");

			return taskCompleted;
		}
	}

];
var taskIndex = 0;
var completedTaskColor = "#33FF33";
var attemptingTaskColor = "#FFFFFF";



/* ***************************************************  */


function init() {
	// get param for testing or not
	var query = window.location.search.substring(1);
	if ( query === "runTestRunner") {
		runTestRunner = true;
	}

	if (runTestRunner) {
		$("#task-number").html(taskIndex + 1);
		for (var i = 0; i < tasks.length; i++) {
			var taskNum = i + 1;
			$("#task-overview").append("<h2> Task "+ taskNum +"</h2>").css('color', "#999999");
		}
		if (taskIndex < tasks.length) {
			$("#task-section > p").html(tasks[taskIndex].description);
			$("#task-overview >").first().css('color', attemptingTaskColor);
		}
	} else {
		$("#task-overview").hide();
		$("#task-section").hide();
	}



	// prevent forms from submitting
	$("form").submit(function(event) {
		event.preventDefault();
	})


	$("#list").hide();
	$("#grouppage").hide();
	$("#groups > .list-header > h2").click( showPage("groups"));
	$('#add-budget-modal').hide();
	$('#add-list-modal').hide();
	$('#add-group-modal').hide();
	$('#add-item-modal').hide();

	$("#app-title").click(showPage("home"));

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

	$("#list > .list-controls").children().click(function() {
		switch($(this).html()) {
			case "Move":
				alert("Move Action: Not yet implemented.");
				break;
			case "Delete":
				alert("Delete Action: Not yet implemented.");
				break;
			default:
				console.log("Unrecognized list control click");
		}
	});

}


function showView( pageId ) {
	if (pageId !== currentView) {
		$(pageId).show();			// show new page
		$(currentView).hide();	// hide current page
		currentView = pageId;		// update current page
	}	
}



function setItemStatusClass( item ) {
	return (item.getStatus() === 'unpacked') ? 'unpacked' : '';
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
		var html = '<li id="item-' + i + '" class="list-object"><a href="#">' + items[i].name + '</a><span id="item-status-' + i + '" class="item-status ' + setItemStatusClass(items[i]) + '"><div class="circle ' + setItemStatusClass(items[i]) + '"></div></span></li>';
		container.append(html);
		container.children().last().click( showPage("item", { 'name' : items[i].name}));
		container.children().last().children(".item-status").click( changeItemStatus(i));
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
		var html = '<li id="group-' + i + '" class="list-object"' + ((i == groups.length-1) ? 'style="border:none"' : '') + '><a href="#">' + groups[i].name + '<span>></span></a></li>';
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
			otherGroupsContainer.children().last().find(".group-membership").click( joinGroup(i));
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
				//console.log(args.name);
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

		if (runTestRunner) {
			if ((taskIndex < tasks.length) && (tasks[taskIndex].check())) {
				taskIndex = taskIndex + 1;
				$("#task-overview :nth-child(" + taskIndex +")").css('color',completedTaskColor);
			
				var taskNum = taskIndex+1;

				if (taskIndex < tasks.length) {
					$("#task-overview :nth-child(" + taskNum +")").css('color',attemptingTaskColor);
					$("#task-number").html(taskNum);
					$("#task-section > p").html(tasks[taskIndex].description);
				} else {
					$("#task-section > p").html("You're finished with testing!");
					$("#task-section > h2").html("Congratulations!");
				}
			}
		}	
	};	
}

function changeItemStatus( index ) {
	return function() {
		var listName = $("#item-list-modal").val();
		// update backend
		try {
			var item = app.editItemFromList(index, listName);
			if ($(this).hasClass('unpacked')) {
				item.setStatus('packed');
			} else {
				item.setStatus('unpacked');
			}
		} catch (error) {
			console.log(error.message);
		}

		// update UI
		$(this).toggleClass('unpacked');
		$(this).children(".circle").toggleClass('unpacked');
	};
}

$(document).ready(function() {
	init();
	app.createStuff();
	app.initListOfGroupsForProduction();
	goToHomePage();

});