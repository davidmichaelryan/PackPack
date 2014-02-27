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

	// bogus method for now
	this.createStuff = function() {
		var list = new module.List("School Supplies");
		list.addItem("Ruler", "A ruler");
		list.addItem("Pencil");
		lists.push(list);

		var list2 = new module.List("Dorm Room Stuff");
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


