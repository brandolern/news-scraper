$(document).ready(function() {
	$("#scrape").on("click", () => {
		$.get("/api/scrape", function(data) {
			alert(data);
			location.replace("/api/articles");
		});
	});

	$(document).on("click", "#save", () => {
		let id = $(this).attr("data-id");
	});
});
