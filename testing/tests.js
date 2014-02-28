/* Unit Tests for Pack Pack library */


/* ********************************************** */
function itemsEqual( itemOne, itemTwo, message ) {
	var str = (message) ? message : "";
	deepEqual(itemOne, itemTwo, str + ": public parameters equal.");
	deepEqual(itemOne.getStatus(), itemTwo.getStatus(), str + ": status equal.");
}

function listsEqual( listOne, listTwo, message ) {
	var str = (message) ? message : "";
	deepEqual(listOne, listTwo, str + ": public parameters equal.");
	deepEqual(listOne.getItems(), listTwo.getItems(), str + ": items equal.");
}


/* ********************************************** */



/* ********************************************** */
module("User Unit Tests");
test("User Construction", function() {
	ok(new PackPack.User(), "Don't have to provide name");
	ok(new PackPack.User("Name"), "Can provide name");
});


/* ********************************************** */
module("Item Unit Tests"); 
test("Item Construction", function() {
	var itemOne = new PackPack.Item();
	ok(itemOne, "No parameters still creates valid object");

	var itemTwo = new PackPack.Item("Name");
	ok(itemTwo, "Just name still creates a valid object");

	var itemThree = new PackPack.Item("Name", "Description");
	ok(itemThree, "Both args creates valid object");
});

test("Item Public Parameters", function() {
	var itemOne = new PackPack.Item();

	deepEqual("", itemOne.name, "No parameters, name is empty string.");
	deepEqual("", itemOne.desc, "No parameters, description is empty string.");

	var itemTwo = new PackPack.Item("MyName", "A Description.");

	deepEqual("MyName", itemTwo.name, "With parameters, get expected name");
	deepEqual("A Description.", itemTwo.desc, "With parameters, get expected description.");

	itemTwo.name = "New Name";
	itemTwo.desc = "New Description.";

	deepEqual("New Name", itemTwo.name, "Name is public and can be changed");
	deepEqual("New Description.", itemTwo.desc, "Description is public and can be changed");


});

test("Item Private Parameters", function() {
	var item = new PackPack.Item("Name", "Description");
	var defaultStatus = "Unpacked";

	// check default value
	deepEqual(defaultStatus, item.getStatus(), "Default status is correct.");

	var status = item.getStatus();

	status = "NewStatus";

	// ensure can't be edited based on get method return value
	deepEqual(defaultStatus, item.getStatus(), "Status is private and can't be externally edited");

	item.setStatus("Packed");

	// ensure is edited by API call
	deepEqual("Packed", item.getStatus(), "Status can be edited via given setter method.");

});

test("Item Copy Function", function() {
	var item = new PackPack.Item("MyName", "A description.");
	item.setStatus("New Status");

	var copyItem = item.copy();

	deepEqual(item, copyItem, "Copy method works.");
	deepEqual(item.getStatus(), copyItem.getStatus(), "Copy also copies private data.");

	copyItem.name = "New Name";
	copyItem.setStatus("Changed Status");

	// ensure copy doesn't leave links between objects
	notDeepEqual(item, copyItem, "Copy creates completely separate object");
	notDeepEqual(item.getStatus(), copyItem.getStatus(), "Copy creates completely separate object including private data");

});


/* ********************************************** */
module("List Unit Tests");
test("List Construction", function() {
	var listOne = new PackPack.List();
	ok(listOne, "No parameters still yields valid a object.");

	var listTwo = new PackPack.List("Name");
	ok(listTwo, "Giving name also yields valid object.");
});

test("List Public Parameters", function() {
	var listOne = new PackPack.List();
	var defaultName = "List";
	deepEqual(defaultName, listOne.name, "Default name correct.");


	var listTwo = new PackPack.List("MyList");
	deepEqual("MyList", listTwo.name, "Given name is correct.");

	listTwo.name = ("MyNewName");
	deepEqual("MyNewName", listTwo.name, "Name is public and can be changed.");
});

test("List Item API", function() {
	var list = new PackPack.List("MyList");
	var expectedItems = [];

	deepEqual(list.getItems(), [], "List starts out empty.");

	// Add three items
	list.addItem();
	expectedItems.push(new PackPack.Item());
	list.addItem("A Name");
	expectedItems.push(new PackPack.Item("A Name"));
	list.addItem("Second Name", "Description");
	expectedItems.push(new PackPack.Item("Second Name", "Description"));

	var myItems = list.getItems();
	deepEqual(myItems, expectedItems, "Get items returns correct array.");

	myItems[myItems.length-1].name = "Changed Name";

	notDeepEqual(myItems, expectedItems, "getItems doesn't return reference to internal data.");


	// getItem
	var oneItem = list.getItem(0);
	deepEqual(oneItem, expectedItems[0], "Get item returns correct item.");
	oneItem.name = "New Name";
	deepEqual(list.getItem(0), expectedItems[0], "Get item returns by value.");
	throws(function() { list.getItem(); }, PackPack.Error, "Must give index to getItem.");
	throws(function() { list.getItem(-1); }, PackPack.Error, "Index must be greater than 0.");
	throws(function() { list.getItem(100); }, PackPack.Error, "Index must not be greater than length of interal list - 1");



	// editItem
	oneItem = list.editItem(1);
	deepEqual(oneItem, expectedItems[1], "Edit item returns correct item.");

	oneItem.name = "New Name";
	expectedItems[1].name = "New Name";
	oneItem.desc = "foobar";
	expectedItems[1].desc = "foobar";
	oneItem.setStatus("Packed");
	expectedItems[1].setStatus("Packed");
	deepEqual(list.getItem(1), expectedItems[1], "Edit item returns by reference to allow editing");

	throws(function() { list.editItem(); }, PackPack.Error, "Must give index to editItem.");
	throws(function() { list.editItem(-1); }, PackPack.Error, "Index must be greater than 0.");
	throws(function() { list.editItem(100); }, PackPack.Error, "Index must not be greater than length of interal list - 1");



	// test remove item
	list.removeItem(myItems.length-1);
	expectedItems.pop();

	deepEqual(list.getItems(), expectedItems, "Remove Items removes correct item.");

	// test remove item with invalid inputs
	throws(function() { list.removeItem(); }, PackPack.Error, "No index given is error.");
	throws(function() { list.removeItem(-1); }, PackPack.Error, "Index must be positive.");
	throws(function() { list.removeItem(4); }, PackPack.Error, "Index must be less than number of items.");
});

test("List Copy Function", function() {
	var list = new PackPack.List("Name");
	list.addItem("Item Name", "Description");

	var copyList = list.copy();

	deepEqual(list, copyList, "Copy creates new object with same attributes");
	deepEqual(list.getItems(), copyList.getItems(), "Copy also copies private data");

	copyList.name = "New Name";
	copyList.addItem("Second Item", "Description");

	notDeepEqual(list, copyList, "Copy doesn't leave any ties to previous object");
	notDeepEqual(list.getItems(), copyList.getItems(), "Copy also doesn't leave ties between private data");
});


/* ********************************************** */
module("App Unit Tests");
test("App Constrution", function() {
	var app = new PackPack.App();
	ok(app, "Don't need to provide username.");

	var app2 = new PackPack.App("Username");
	ok(app2, "Can provide user name");
});

test("User API for App", function() {
	var app = new PackPack.App("User A");
	deepEqual("User A", app.getUserName(), "Get user name works.");

	var name = app.getUserName();
	name = "User B";
	deepEqual("User A", app.getUserName(), "getUserName returns by value, not by reference.");
	
});

test("Get/Add/Delete List API for App", function() {
	var app = new PackPack.App("User A");
	var expectedLists = [];

	deepEqual(expectedLists, app.getLists(), "Default app starts out with no lists");

	app.addList("List 1");
	var expectedList = new PackPack.List("List 1");
	expectedLists.push(expectedList);
	app.addList();										// allow default lists to be added
	expectedLists.push(new PackPack.List());
	app.addList("List 2");
	expectedLists.push(new PackPack.List("List 2"));


	var myLists = app.getLists();
	deepEqual(expectedLists, myLists, "Add list works and adds list to app.");

	throws(function() { app.addList("List 1");}, PackPack.Error, "Can't add list with same name as another list.");

	myLists[myLists.length-1].name = "List Name Changed";
	myLists[myLists.length-1].addItem("Name", "Description");

	deepEqual(expectedLists, app.getLists(), "Get Lists doesn't return reference to internal data.");

	// test getList
	var myList = app.getList("List 1");
	deepEqual(expectedList, myList, "Get list returns list if name exists.");
	myList.name = "List 1 New";
	myList.addItem("Another item");
	deepEqual(expectedList, app.getList("List 1"), "Get list returns by value, not by reference.");
	deepEqual(expectedList.getItems(), app.getList("List 1").getItems(), "Also doesn't leave reference to private data.");

	// test invalid inputs to getList
	throws(function() { app.getList(); }, PackPack.Error, "Must provide list name");
	throws(function() { app.getList("List 100"); }, PackPack.Error, "Must provide list name that exists in app.");


	// test deleteList
	app.deleteList("List 2");
	expectedLists.pop();
	deepEqual(expectedLists, app.getLists(), "Delete List works.");
	throws(function() { app.deleteList(); }, PackPack.Error, "Must give list name.");
	throws(function() { app.deleteList("List 100"); }, PackPack.Error, "Must give name that exists.");
});

test("Edit Lists API for App", function() {
	var app = new PackPack.App("User A");
	app.addList("Test List");
	app.changeListName("Test List", "New List Name");
	ok(app.getList("New List Name"), "Change list name updated list internally.");

	throws(function() { app.changeListName("Nonexistent List", "New List Name"); }, PackPack.Error, "Must give name of list that exists.");
	throws(function() { app.changeListName(); }, PackPack.Error, "Must give valid strings as inputs");

});

test("Add/Edit/Remove Item API for App", function() {
	var app = new PackPack.App("User A");
	app.addList("Test List");
	var expectedList = new PackPack.List("Test List");

	// add
	app.addItemToList("Name", "Description", "Test List");
	expectedList.addItem("Name", "Description");
	deepEqual(app.getList("Test List").getItems(), expectedList.getItems(), "Add item correctly adds an item");

	app.addItemToList(undefined, undefined, "Test List");
	expectedList.addItem(undefined, undefined);
	deepEqual(app.getList("Test List").getItems(), expectedList.getItems(), "Add item to list doesn't require name or description");


	throws(function() { app.addItemToList("Name", "Description", "Invalid List");}, PackPack.Error, "Must give valid list name to add item to list.");
	throws(function() { app.addItemToList("Name", "Description"); }, PackPack.Error, "Must provide list name.");



	// get
	var item = app.getItemFromList(0, "Test List");
	var expectedItem = expectedList.getItem(0);
	itemsEqual(item, expectedItem, "getItemFromList");
	item.name = "Changed Name";
	item.desc = "Changed description";
	item.setStatus("Packed");
	itemsEqual(app.getItemFromList(0, "Test List"), expectedItem, "getItemFromList returns a copy");

	throws(function() { app.getItemFromList(-1, "Test List"); }, PackPack.Error, "getItemFromList must be given index > 0");
	throws(function() { app.getItemFromList(100, "Test List"); }, PackPack.Error, "getItemFromList must be given index < list size - 1");
	throws(function() { app.getItemFromList(0, "Invalid List"); }, PackPack.Error, "getItemFromList must be given valid list name");
	throws(function() { app.getItemFromList(0, undefined); }, PackPack.Error, "getItemFromList must be given a list name");


	deepEqual(app.getList("Test List").getItems(), expectedList.getItems(), "sanity check");

	console.log(app.getList("Test List").getItems());
	console.log(expectedList.getItems());

	// edit
	item = app.editItemFromList(1, "Test List");
	expectedItem = expectedList.editItem(1);
	itemsEqual(item, expectedItem, "editItemFromList");
	item.name = "Changed Name";
	expectedItem.name = "Changed Name";
	item.desc = "Changed description";
	expectedItem.desc = "Changed description";
	item.setStatus("Packed");
	expectedItem.setStatus("Packed");
	itemsEqual(app.getItemFromList(1, "Test List"), expectedItem, "getItemFromList returns by reference to allow editing.");

	throws(function() { app.editItemFromList(-1, "Test List"); }, PackPack.Error, "editItemFromList must be given index > 0");
	throws(function() { app.editItemFromList(100, "Test List"); }, PackPack.Error, "editItemFromList must be given index < list size - 1");
	throws(function() { app.editItemFromList(1, "Invalid List"); }, PackPack.Error, "editItemFromList must be given valid list name");
	throws(function() { app.editItemFromList(1, undefined); }, PackPack.Error, "editItemFromList must be given a list name");



	// remove
	app.removeItemFromList(0, "Test List");
	expectedList.removeItem(0);
	listsEqual(app.getList("Test List"), expectedList, "removeItemFromList");

	app.addItemToList("MyName", "", "Test List"); // make sure list has enough items for calls below
	app.addItemToList("MyName", "", "Test List");

	throws(function() { app.removeItemFromList(-1, "Test List"); }, PackPack.Error, "removeItemFromList must be given index > 0");
	throws(function() { app.removeItemFromList(100, "Test List"); }, PackPack.Error, "removeItemFromList must be given index < list size - 1");
	throws(function() { app.removeItemFromList(0, "Invalid List"); }, PackPack.Error, "removeItemFromList must be given valid list name");
	throws(function() { app.removeItemFromList(0, undefined); }, PackPack.Error, "removeItemFromList must be given a list name");





});



















