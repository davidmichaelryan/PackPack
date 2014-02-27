/* packPack.js */

/*
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
*/

// Prevent polluting global namespace
var PackPack = (function() {

	var app = {};


	// Errors
	app.Error = function( message , type) {
		this.message = (message) ? message : "Error";
		this.type = (type) ? type : "Default";
	};
/*
// User Class
function User( properties ) {
	var $this = this; // Store class scope in variable $this

	//Iterate through the properties of the object
    for ( var i in properties )
    {
        (function(i)
        {
            // Dynamically create an accessor method
            $this[ "get" + i ] = function()
            {
                return properties[i];
            };
        })(i);
    }
}
*/

// Item Class
app.Item = function( itemName, description ) {

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
		var copyItem = new app.Item(this.name, this.desc);
		copyItem.setStatus(this.getStatus());
		return copyItem;
	}


};


// List Class
app.List = function( name ) {

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
		listItems.push(new app.Item(name, description));
	}

	this.removeItem = function( index ) {
		if ((index >= 0) && (index < listItems.length)) {
			listItems.splice(index, 1);
		} else {
			throw new app.Error("Invalid index given to removeItem");
		}
	}

}


/*
// PackPack class
function PackPack( userProp ) {
	// Private Data
	var user = new User(userProp);
	var lists = [];
	var groups = [];

	this.getLists = function() {
		return lists;
	}

	this.getList = function( name ) {
		for (var i=0; i < lists.length; i++) {
			if (lists[i].getName() == name) {
				return lists[i];
			}
		}

		console.log("No list found with name " + name + ".");
	}

	// Private method
	var getIndexOfList = function( name ) {
		for (var i=0; i < lists.length; i++) {
			if (lists[i].getName() == name) {
				return i;
			}
		}
		// didn't find list
		return -1;
	}

	this.getGroups = function() {
		return groups;
	}

	this.addList = function( name ) {
		if (getIndexOfList(name) == -1) {
			var myList = new List(name);
			lists.push(myList);
		} else {
			console.log("List name '" + name + "' already exists, please use another.");
		}
		
	}

	this.deleteList = function( name ) {
		var index = getIndexOfList(name);
		if (index !== -1) {
			lists.splice(index, 1);
		} else {
			console.log("List by name " + name + " doesn't exist.");
		}
	}


}
*/


	return app;

}());


