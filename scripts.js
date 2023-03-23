let notes = JSON.parse(localStorage.getItem("notes")) || [];

const addNoteButton = document.querySelector("#add");

const notesContainer = document.querySelector(".notesBody");
const sortBy = document.querySelector("#sortBy");

const viewerContainer = document.querySelector(".viewerContainer")
const viewerTitle = document.querySelector(".viewerContainer h2")
const viewerDate = document.querySelector(".viewerDate")
const viewerBody = document.querySelector(".viewerBody pre");

const backdrop = document.querySelector("#backdrop");
const form = document.querySelector("#noteForm");
const titleInput = document.querySelector("#title");
const textInput = document.querySelector("#text");
const submit = document.querySelector("#formSubmit");
const cancel = document.querySelector("#formCancel");

const filters = {
    query: "",
    sort: "Created"
}

sortBy.addEventListener("change", (e) => {
    filters.sort = e.target.value;
    renderNotes();
})

// Sorting the notes
const sortNotes = () => {
    if (filters.sort === "Alpha") {
        notes.sort((a, b) => {
            if (a.title > b.title) {
                return 1
            } else if (b.title > a.title) {
                return -1
            } else {
                return 0
            }
        })
    } else if (filters.sort === "Edited") {
        notes.sort((a, b) => b.dateEdited - a.dateEdited)
    } else if (filters.sort === "Created") {
        notes.sort((a, b) => b.dateCreated - a.dateCreated)
    }
}

const renderNotes = () => {

    // Set up: Sort notes and clear notes container
    sortNotes()
    notesContainer.innerHTML = "";

    // If viewer box currently has a note in view, reload that same data
    if (viewerContainer.attributes["data-id"]) {
        const filtered = notes.filter((item) => {
            return item.id === +viewerContainer.attributes["data-id"].value
        })[0] || {title: "", dateToString: "", text: ""}

        viewerTitle.textContent = filtered.title;
        viewerDate.textContent = filtered.dateToString;
        viewerBody.textContent = filtered.text;
    }

    notes.forEach((note) => {
        const div = document.createElement("div");
        div.classList.add("buttonContainer");

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("optionsContainer");

        const button = document.createElement("button");
        button.textContent = note.title;
        button.classList.add("noteButton")

        const dateSpan = document.createElement("span");

        dateSpan.textContent = note.dateToString;
        button.appendChild(dateSpan)

        button.addEventListener("click", () => {
            viewerContainer.setAttribute("data-id", note.id)
            viewerTitle.textContent = note.title;
            viewerDate.textContent = note.dateToString;
            viewerBody.textContent = note.text;
        })

        const editButton = document.createElement("button");
        editButton.textContent = "..."
        editButton.addEventListener("click", () => {
            editNote(note)
        })

        const removeButton = document.createElement("button");
        removeButton.textContent = "X"
        removeButton.addEventListener("click", () => {
            removeNote(note.id)
        })

        optionsDiv.appendChild(removeButton);
        optionsDiv.appendChild(editButton)
        div.appendChild(button)
        div.appendChild(optionsDiv)
        notesContainer.appendChild(div);
    })
}

addNoteButton.addEventListener("click", () => {

    backdrop.classList.toggle("open");
    addNote();

})

const addNote = () => {

    const submitClick = (e) => {
        e.preventDefault()

        if (titleInput.value.trim() !== "" || textInput.value.trim() !== "") {

            const date = new Date().getTime()
            const dateConversion = new Date().toDateString().split(" ");
            dateConversion.shift();

            notes.push({
                title: titleInput.value.trim() || "Untitled Note",
                text: textInput.value.trim() || "",
                id: date,
                dateCreated: date,
                dateEdited: date,
                dateToString: `${dateConversion[0]} ${dateConversion[1]}, ${dateConversion[2]}`
            })

            saveNotes();

        }

        form.reset();
        backdrop.classList.toggle("open");
        submit.removeEventListener("click", submitClick);
        cancel.removeEventListener("click", cancelClick);
    }

    const cancelClick = () => {
        form.reset();
        backdrop.classList.toggle("open");
        submit.removeEventListener("click", submitClick);
        cancel.removeEventListener("click", cancelClick);
    }

    submit.addEventListener("click", submitClick);
    cancel.addEventListener("click", cancelClick);

}

const saveNotes = () => {
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
}

const removeNote = (id) => {
    notes = notes.filter((note) => {
        return note.id !== id
    })
    saveNotes()
}

const editNote = (note) => {
    backdrop.classList.toggle("open");
    titleInput.value = note.title;
    textInput.value = note.text.replace("<pre>", "").replace("</pre>", "");

    const submitClick = (e) => {
        e.preventDefault();

        if (titleInput.value.trim() === "" && textInput.value.trim() === "") {
            removeNote(note.id)
        }

        note.title = titleInput.value.trim() || "Untitled Note";
        note.text = textInput.value.trim() || "";
        note.dateEdited = new Date().getTime();
        saveNotes()
        form.reset();
        backdrop.classList.toggle("open");
        submit.removeEventListener("click", submitClick);
        cancel.removeEventListener("click", cancelClick);
    }

    const cancelClick = () => {
        form.reset();
        backdrop.classList.toggle("open");
        submit.removeEventListener("click", submitClick);
        cancel.removeEventListener("click", cancelClick);
    }

    submit.addEventListener("click", submitClick);
    cancel.addEventListener("click", cancelClick);
}

renderNotes();

// Reformat code into Variables, Functions, Scripts
// Style page / clear all button
// Remove "notes" title and add Search bar / filter
// Add todo function?

// -- Alternative version: Login/Firebase?