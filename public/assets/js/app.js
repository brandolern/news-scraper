$(document).ready(function() {
	$("#scrape").on("click", () => {
		$.get("/scrape", function(data) {
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
				location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	});

	$(document).on("click", "#view-notes", function() {
		let id = $(this).attr("data-id");
		$("#note-modal").modal();
	});

	$(document).on("click", "#save-note", function() {
		let id = $(this).attr("data-id");
		let url = `/api/articles/${id}/note`;
		let note = {
			title: $("#note-title")
				.val()
				.trim(),
			body: $("#note-body")
				.val()
				.trim()
		};
		$.ajax({
			type: "post",
			url: url,
			data: note
		})
			.then(function(data, status) {
				if (status) console.log(data);
				$("#note-title").val("");
				$("#note-body").val("");
			})
			.catch(err => {
				if (err) throw err;
			});
	});
});
