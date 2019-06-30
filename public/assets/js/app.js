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

	$(document).on("click", ".delete", function() {
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

	$(document).on("click", ".view-notes", function() {
		let id = $(this).attr("data-id");

		$("#save-note").attr("data-id", id);
		$.get(`/api/articles/${id}`, function(data) {
			for (i = 0; i < data.notes.length; i++) {
				let noteItem = $("<li>")
					.attr("id", "note-item")
					.addClass("lead");
				let noteTitle = $("<h5>")
					.attr("id", "note-title")
					.text(data.notes[i].title);
				let noteBody = $("<p>")
					.attr("id", "note-body")
					.text(data.notes[i].body);
				let deleteButton = $("<button>")
					.attr("id", "delete-note", "type", "button", "data-id", data.id)
					.addClass("close");
				let deleteNote = $("<span>")
					.attr("aria-hidden", true)
					.html("&times;");
				deleteButton.append(deleteNote);
				noteTitle.append(deleteButton);
				noteItem.append(noteTitle, noteBody);
				$("#note-container").append(noteItem);
			}
			// $("#note-title").val("");
			// $("#note-body").val("");
			$("#note-modal").modal();
		});
	});

	$(document).on("click", "#close-note-modal", function() {
		$("#note-container").empty();
	});

	$(document).on("click", "#save-note", function() {
		let id = $(this).attr("data-id");
		let url = `/api/articles/${id}/note`;
		console.log($("#note-title").val());
		let note = {
			title: $("#note-title")
				.val()
				.trim(),
			body: $("#note-body")
				.val()
				.trim()
		};
		console.log(note);
		$.ajax({
			type: "post",
			url: url,
			data: note
		})
			.then(function(data, status) {
				if (status) location.reload();
			})
			.catch(err => {
				if (err) throw err;
			});
	});
});
