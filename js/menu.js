$(document).ready(function() {
	// Boolean that holds the state of the menu's visibility
	menuVisible = false;

	// Click handler for the menu button
	$("#menu-button").click(function(e) {
		// Stop passing the click handler up the DOM tree
		e.stopPropagation();
		// Toggle our classes that move the menu onto the screen
		$("#menu").toggleClass('menu-push');
		$("#main-screen").toggleClass('screen-push');
		// Update whether the menu is visible
		menuVisible = !menuVisible;
	});

	// Click handler for the screen
	// TODO: This is an additional safety measure. If the user clicks the
	// menu button, and then clicks on the sliver of the screen visible
	// (to the right) we assume they want to return to the screen. There
	// might be a better way to handle this.
	$("#main-screen").not("#header").click(function() {
		// If the menu isn't visible, then ignore the requent
		if(menuVisible) {
			// Otherwise, toggle our classes to hide the menu
			$("#menu").toggleClass('menu-push');
			$("#main-screen").toggleClass('screen-push');
			menuVisible = !menuVisible;
		}
	});
});