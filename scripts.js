let notes = JSON.parse(localStorage.getItem("notes")) || [];

const addNoteButton = document.querySelector("#add");

const notesContainer = document.querySelector(".notesContainer");
const notesViewer = document.querySelector(".viewerContainer");
const notesTitle = document.querySelector(".notesViewer h2")

const backdrop = document.querySelector("#backdrop");
const form = document.querySelector("#noteForm");
const titleInput = document.querySelector("#title");
const textInput = document.querySelector("#text");
const submit = document.querySelector("#formSubmit");
const cancel = document.querySelector("#formCancel");

const renderNotes = () => {
    notesContainer.innerHTML = "";

    notes.forEach((note) => {
        const div = document.createElement("div");

        const button = document.createElement("button");
        button.textContent = note.title;

        button.addEventListener("click", () => {
            notesTitle.textContent = note.title;
            notesViewer.innerHTML = note.text;
        })

        const editButton = document.createElement("button");
        editButton.textContent = "edit"
        editButton.addEventListener("click", () => {
            editNote(note)
        })

        const removeButton = document.createElement("button");
        removeButton.textContent = "X"
        removeButton.addEventListener("click", () => {
            removeNote(note.id)
        })

        div.appendChild(removeButton)
        div.appendChild(button)
        div.appendChild(editButton)
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

            notes.push({
                title: titleInput.value.trim() || "Untitled Note",
                text: `<pre>${textInput.value.trim()}</pre>` || "",
                id: date,
                dateCreated: date,
                dateEdited: date
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
        note.text = `<pre>${textInput.value.trim()}</pre>` || "";
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

// How to refresh viewer content when changes made
