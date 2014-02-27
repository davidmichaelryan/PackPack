/* Unit Tests for Pack Pack library */

/* ********************************************** */
module( "Item Unit Tests"); 
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

	copyItem.name = "New Name";
	copyItem.setStatus("Changed Status");

	// ensure copy doesn't leave links between objects
	notDeepEqual(item, copyItem, "Copy creates completely separate object");

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

	deepEqual([], list.getItems(), "List starts out empty.");

	// Add three items
	list.addItem();
	expectedItems.push(new PackPack.Item());
	list.addItem("A Name");
	expectedItems.push(new PackPack.Item("A Name"));
	list.addItem("Second Name", "Description");
	expectedItems.push(new PackPack.Item("Second Name", "Description"));

	var myItems = list.getItems();
	deepEqual(expectedItems, myItems, "Get items returns correct array.");

	myItems[myItems.length-1].name = "Changed Name";

	notDeepEqual(expectedItems, myItems, "getItems doesn't return reference to internal data.");

	// test remove item
	list.removeItem(myItems.length-1);
	expectedItems.pop();

	deepEqual(expectedItems, list.getItems(), "Remove Items removes correct item.");

	// test remove item with invalid inputs
	throws(function() { list.removeItem(); }, PackPack.Error, "No index given is error.");
	throws(function() { list.removeItem(-1); }, PackPack.Error, "Index must be positive.");
	throws(function() { list.removeItem(4); }, PackPack.Error, "Index must be less than number of items.");
});
















