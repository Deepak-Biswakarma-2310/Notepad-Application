const myNotesListElm = document.querySelector("#my-notes-list");
const noteContentTextarea = document.querySelector("#noteContent");

// Retrieve notes list from local storage
function getNotesListFromLocalStorage() {
    let stringifiedNotesList = localStorage.getItem("notesList");
    let parsedNotesList = JSON.parse(stringifiedNotesList);
    return parsedNotesList === null ? [] : parsedNotesList;
}

// Initialize notes list
let notesList = getNotesListFromLocalStorage();

// Save notes to local storage
const saveNotesBtn = document.querySelector(".save-notes-button");
saveNotesBtn.addEventListener("click", function() {
    localStorage.setItem("notesList", JSON.stringify(notesList));
});

// Delete a note
function deleteNote(noteId) {
    let noteElm = document.getElementById(noteId);
    myNotesListElm.removeChild(noteElm);

    // Remove the note from the notesList array
    let deleteElementIndex = notesList.findIndex(function (eachNote) {
        let eachNoteId = "note" + eachNote.id;
        return eachNoteId === noteId;
    });
    notesList.splice(deleteElementIndex, 1);

    // Clear the note content in the right container if any note is deleted
    noteContentTextarea.value = "";
    noteContentTextarea.removeAttribute('data-note-id');

    // Update local storage
    localStorage.setItem("notesList", JSON.stringify(notesList));
}

// Create and append a note to the list
function createAndAppendNote(note) {
    let noteId = "note" + note.id;

    const myNote = document.createElement("li");
    myNote.id = noteId;
    myNote.classList.add("my-note");

    const myNotePara = document.createElement("p");
    myNotePara.innerText = note.title;

    const myNoteDel = document.createElement("span");
    myNoteDel.classList.add("material-symbols-outlined");
    myNoteDel.innerText = "delete";
    myNoteDel.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent click event from bubbling up to the note itself
        deleteNote(noteId);
    });

    // Add click event to load the note content into the right container for editing
    myNote.addEventListener("click", function() {
        noteContentTextarea.value = note.content;
        noteContentTextarea.setAttribute('data-note-id', noteId);
    });

    myNotesListElm.appendChild(myNote);
    myNote.appendChild(myNotePara);
    myNote.appendChild(myNoteDel);
}

// Initial population of the notes list
for (let note of notesList) {
    createAndAppendNote(note);
}

// Add a new note
const addNoteBtn = document.querySelector(".add-note-button");

function displayError(inputElement, message) {
    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.innerText = message;
    errorMessage.style.color = "#cbd5e1";
    errorMessage.style.fontSize = "0.9em";
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
}

function addNote() {
    let noteTitle = document.querySelector("#title");
    let notePara = document.querySelector("#note");

    let noteTitleValue = noteTitle.value.trim();
    let noteParaValue = notePara.value.trim();

    // Remove existing error messages
    let existingErrors = document.querySelectorAll(".error-message");
    existingErrors.forEach(error => error.remove());

    let isValid = true;

    if (noteTitleValue === "") {
        displayError(noteTitle, "Title is required*");
        isValid = false;
    }

    if (noteParaValue === "") {
        displayError(notePara, "Note is required*");
        isValid = false;
    }

    if (isValid) {
        let newNote = {
            id: notesList.length + 1,
            title: noteTitleValue,
            content: noteParaValue
        };
        notesList.push(newNote);
        createAndAppendNote(newNote);

        noteTitle.value = "";
        notePara.value = "";
    }
}

addNoteBtn.addEventListener("click", function() {
    addNote();
});

// Autosave note content in the right container on input change
noteContentTextarea.addEventListener("input", function() {
    let noteId = noteContentTextarea.getAttribute('data-note-id');
    if (noteId) {
        let noteToEdit = notesList.find(note => "note" + note.id === noteId);
        if (noteToEdit) {
            noteToEdit.content = noteContentTextarea.value;

            // Autosave to local storage
            localStorage.setItem("notesList", JSON.stringify(notesList));
        }
    }
});