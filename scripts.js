let notes = JSON.parse(localStorage.getItem("notes")) || [];

const addNoteButton = document.querySelector("#add");

const notesContainer = document.querySelector(".notesBody");

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

const renderNotes = () => {
    notesContainer.innerHTML = "";

    if (viewerContainer.attributes["data-id"]) {
        const filtered = notes.filter((item) => {
            return item.id === +viewerContainer.attributes["data-id"].value
        })[0] || {title: "", text:""}

        viewerTitle.textContent = filtered.title;
        viewerDate.textContent = filtered.dateCreated;
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
        let date = new Date(note.dateCreated).toDateString().split(" ");
        date.shift();

        dateSpan.textContent = `${date[0]} ${date[1]}, ${date[2]}`;
        button.appendChild(dateSpan)

        button.addEventListener("click", () => {
            viewerContainer.setAttribute("data-id", note.id)
            viewerTitle.textContent = note.title;
            viewerDate.textContent = `${date[0]} ${date[1]}, ${date[2]}`;
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

            notes.push({
                title: titleInput.value.trim() || "Untitled Note",
                text: textInput.value.trim() || "",
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
// Sorting function
// Add todo function?

// -- Alternative version: Login/Firebase?