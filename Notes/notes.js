const addBtn = document.querySelector("#addBtn")
const main = document.querySelector("#main")
addBtn.addEventListener(
    "click",
    function() {
        addNote()
    }
)
const saveNotes = () => {
    const notes = document.querySelectorAll(".note textarea");
    console.log(notes);
    const data = [];
    notes.forEach(
            (note) => {
                data.push(note.value)
            }
        )
        // console.log(data)
    if (data.length === 0) {
        localStorage.removeItem("notes")
    } else {
        localStorage.setItem("notes", JSON.stringify(data))
    }
}


// Select the scroll button element
const scrollBtn = document.querySelector("#addBtn");

// Add an event listener to the scroll button
scrollBtn.addEventListener("click", function () {
    // Scroll the entire page body down
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const textareas = document.querySelectorAll('.note textarea');

    textareas.forEach(textarea => {
        textarea.style.height = textarea.scrollHeight + 'px';

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
    });
});


//save button

const addNote = (text = "") => {
    const note = document.createElement("div");
    note.classList.add("note")
    note.innerHTML = `
    <div class="tool">
         <p class="N">Note</p>
         <i class="save fas fa-save"></i>
         <i class="trash fas fa-trash"></i> 
    </div>
   <textarea class="dynamic-textarea" placeholder="Type your note here">${text}</textarea>
   <p class="saved-message">Saved!</p>
    `;

    const savedMessage = note.querySelector(".saved-message");
    
    note.querySelector(".trash").addEventListener(
        "click",
        function() {
            note.remove()
            saveNotes()
        }
    )
    note.querySelector(".save").addEventListener(
        "click",
        function() {
            savedMessage.style.opacity = 1;
            savedMessage.style.color = "white"; // Set the text color to blue
            
            setTimeout(() => {
                savedMessage.style.opacity = 0;
            }, 1000);
            saveNotes()
        }
    )
    note.querySelector("textarea").addEventListener(
        "focusout",
        function() {
            saveNotes()
        }
    )
    main.appendChild(note);
    saveNotes()
}


(
    function() {
        const lsNotes = JSON.parse(localStorage.getItem("notes"));
        if (lsNotes === null) {
            addNote()
        } else {
            lsNotes.forEach(
                (lsNote) => {
                    addNote(lsNote)
                }
            )
        }

    }
)()

