$(document).ready(function() {
	$("#scrape").on("click", () => {
		$.get("/api/scrape", function(data) {
			alert(data);
			location.replace("/api/articles");
		});
	});

	$(document).on("click", "#save", function() {
		let id = $(this).attr("data-id");
		const url = `/api/articles/${id}/save`;
		$.ajax({
			type: "put",
			url: url
		})
			.then(function(data) {
				alert("Article saved");
			})
			.catch(err => {
				if (err) throw err;
			});
	});

	$(document).on("click", "#delete", function() {
		let id = $(this).attr("data-id");
		const url = `/api/articles/${id}/delete`;
		$.ajax({
			type: "put",
			url: url
		})
			.then(function(data) {
				alert(data);
				location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	});

	$(document).on("click", "#add-note", function() {
		let id = $(this).attr("data-id");
		const url = `/api/articles/${id}/delete`;
		$.post("/api/articles/:id/", function(data) {
			alert("Note Saved");
		});
	});
});
