// Global boolean that holds the state of the menu's visibility
menuVisible = false;

$(document).ready(function() {
	// Click handler for the menu button
	$("#menu-button").click(function(e) {
		// Stop passing the click handler up the DOM tree
		e.stopPropagation();
		toggleMenu();
	});

	// This is an additional safety measure. If the user clicks the
	// menu button, and then clicks on the sliver of the screen visible
	// (to the right) we assume they want to return to the screen.
	$("#main-screen").not("#header").click(function() {
		// If the menu isn't visible, then ignore the requent
		if(menuVisible) {
			toggleMenu();
		}
	});

	$("#menu a").click(function() {
		toggleMenu();
	});
});

function toggleMenu() {
	// Toggle our classes that move the menu onto the screen
	$("#menu").toggleClass('menu-push');
	$("#main-screen").toggleClass('screen-push');
	// Update whether the menu is visible
	menuVisible = !menuVisible;
}