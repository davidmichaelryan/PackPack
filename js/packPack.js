/* packPack.js */


// Prevent polluting global namespace
var PackPack = (function() {

	var module = {};


	// Errors
	module.Error = function( message , type) {
		this.message = (message) ? message : "Error";
		this.type = (type) ? type : "Default";
	};

// User Class
module.User = function( name ) {
	this.name = (name) ? name : "User";
};


// Item Class
module.Item = function( itemName, description ) {

	// Data
	this.name = (itemName) ? itemName : "";
	this.desc = (description) ? description : "";
	var status = "Unpacked"; // want to make this an object?
	// link to id of dom element of picture?


	// Actions
	this.getStatus = function() {
		return status;
	}

	this.setStatus = function( newStatus ) {
		status = newStatus;
	}

	this.copy = function() {
		var copyItem = new module.Item(this.name, this.desc);
		copyItem.setStatus(this.getStatus());
		return copyItem;
	}


};


// List Class
module.List = function( name ) {

	this.name = (name) ? name : "List";
	var listItems = [];


	this.getItems = function() {
		var items = [];
		for (var i = 0; i < listItems.length; i++) {
			items.push(listItems[i].copy());
		}
		return items;
	}

	// get one item, return by value
	this.getItem = function( index ) {
		if ((index >= 0) && (index < listItems.length)) {
			return listItems[index].copy();	// return a copy
		} else {
			throw new module.Error("Invalid index given to getItem", "Index");
		}
	}

	// get reference to an item to allow for editing
	this.editItem = function( index ) {
		if ((index >= 0) && (index < listItems.length)) {
			return listItems[index];	// return by reference
		} else {
			throw new module.Error("Invalid index given to getItem", "Index");
		}
	}

	this.addItem = function( name, description ) {
		listItems.push(new module.Item(name, description));
	}

	this.removeItem = function( index ) {
		if ((index >= 0) && (index < listItems.length)) {
			listItems.splice(index, 1);
		} else {
			throw new module.Error("Invalid index given to removeItem", "Index");
		}
	}

	this.copy = function() {
		var copyList = new module.List(this.name);
		for (var i = 0; i < listItems.length; i++) {
			copyList.addItem(listItems[i].name, listItems[i].desc);
		}
		return copyList;
	}

}



// App class
module.App = function( userName ) {
	// Private Data
	var user = new module.User(userName);
	var lists = [];
	//var groups = [];


	// Private method
	var getIndexOfList = function( name ) {
		for (var i=0; i < lists.length; i++) {
			if (lists[i].name === name) {
				return i;
			}
		}
		// didn't find list
		return -1;
	}


	// Public methods
	this.getUserName = function() {
		return user.name;
	}

	this.getLists = function() {
		var myLists = [];
		for (var i = 0; i < lists.length; i++) {
			myLists.push(lists[i].copy());
		}
		return myLists;
	}

	this.getList = function( name ) {
		for (var i=0; i < lists.length; i++) {
			if (lists[i].name == name) {
				return lists[i].copy();
			}
		}

		throw new module. Error("No list found with name " + name + ".", "Not Found");
	}

	this.addList = function( name ) {
		if (!(name)) {
			throw new module.Error("Must provide a list name");
		}
		if (getIndexOfList(name) == -1) {
			var myList = new module.List(name);
			lists.push(myList);
		} else {
			throw new module.Error("List name '" + name + "' already exists, please use another.", "Duplicate");
		}
		
	}

	this.deleteList = function( name ) {
		var index = getIndexOfList(name);
		if (index !== -1) {
			lists.splice(index, 1);
		} else {
			throw new module.Error("List by name " + name + " doesn't exist.", "Not Found");
		}
	}

	this.changeListName = function( oldName, newName) {
		if (!(typeof oldName == "string") || !(typeof newName == "string")) {
			throw new module.Error("Please provide two valid strings as names.", "Invalid Input");
		}

		var index = getIndexOfList(oldName);
		if (index > -1) {
			lists[index].name = newName;
		} else {
			throw new module.Error("Can't edit list that doesn't exist.", "Not Found");
		}
	}

	// return by copy/value
	this.getItemFromList = function( index, listName ) {
		if (typeof listName != "string") {
			throw new module.Error("Must provide valid list name.", "Invalid Input");
		}

		var listIndex = getIndexOfList(listName);
		if (listIndex !== -1) {
			return lists[listIndex].getItem(index);
		} else {
			throw new module.Error("Must provide valid list name.", "Not Found");
		}
	}


	// return by reference
	this.editItemFromList = function( index, listName ) {
		if (typeof listName != "string") {
			throw new module.Error("Must provide valid list name.", "Invalid Input");
		}

		var listIndex = getIndexOfList(listName);
		if (listIndex !== -1) {
			return lists[listIndex].editItem(index);
		} else {
			throw new module.Error("Must provide valid list name.", "Not Found");
		}
	}

	// add
	this.addItemToList = function( name, description, listName ) {
		if (typeof listName != "string") {
			throw new module.Error("Must provide valid list name.", "Invalid Input");
		}

		var index = getIndexOfList(listName);
		if (index !== -1) {
			lists[index].addItem(name, description);
		} else {
			throw new module.Error("Must provide valid list name.", "Not Found");
		}
	}

	// delete
	this.removeItemFromList = function( index, listName ) {
		if (typeof listName != "string") {
			throw new module.Error("Must provide valid list name.", "Invalid Input");
		}

		var listIndex = getIndexOfList(listName);
		if (listIndex !== -1) {
			lists[listIndex].removeItem(index);
		} else {
			throw new module.Error("Must provide valid list name.", "Not Found");
		}
	}



	// bogus method for now
	this.createStuff = function() {
		var list = new module.List("School Supplies");
		list.addItem("Ruler", "A ruler");
		list.addItem("Pencil");
		lists.push(list);

		var numItems = 20;
		var list2 = new module.List("Dorm Room Stuff");
		for (var i = 0; i < numItems; i++) {
			list2.addItem("Item " + i);
		}
		lists.push(list2);
	}

	/*
	this.getGroups = function() {
		return groups;
	}
	*/


}



	return module;

}());


