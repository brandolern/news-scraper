$(document).ready(function() {
	$("#scrape").on("click", () => {
		$.get("/scrape", function(data) {
			alert(data);
			location.replace("/articles");
		});
	});

	$(document).on("click", "#save", () => {
		let id = $(this).attr("data-id");
	});
});
