const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const voiceButton = document.querySelector("#voice-btn");

let userText = null;

const recognition = new webkitSpeechRecognition();
recognition.lang = "en-GB";
recognition.continuous = true;

let silenceTimeout = null; // Timer for silence detection
let isRecognitionRunning = false;

recognition.onresult = function(event) {
    // Clear the silence timeout on every result
    clearTimeout(silenceTimeout);

    const transcript = event.results[0][0].transcript;
    document.getElementById("chat-input").value = transcript;

    // Start a new silence timeout
    silenceTimeout = setTimeout(stopVoiceRecognition, 5000); // Adjust the duration as needed
};

function startVoiceRecognition() {
    if (!isRecognitionRunning) { // Check if recognition is not already running
        try {
            recognition.start();
            isRecognitionRunning = true;
            silenceTimeout = setTimeout(stopVoiceRecognition, 5000);
        } catch (error) {
            console.error("Error starting voice recognition:", error);
        }
    }
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
        clearTimeout(silenceTimeout);
    }
}

// Call startVoiceRecognition when a button is clicked

voiceButton.addEventListener("click", () => {
    startVoiceRecognition();
});

// ... Your existing code ...

const indicator = document.getElementById("indicator-circle");
//const voiceButton = document.getElementById("voice-btn"); // Update button ID

recognition.onstart = function() {
    // Change indicator circle color to green when recording starts
    indicator.style.backgroundColor = "green";
};

recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById("chat-input").value = transcript;
    console.log("working");
};

recognition.onend = function() {
    // Reset indicator circle color to red when recording ends
    indicator.style.backgroundColor = "red";
};

// Call startVoiceRecognition when the button is clicked
voiceButton.addEventListener("click", () => {
    // Request microphone access and start recognition
    startVoiceRecognition();
});



// for scrolling down
const initialHeight = chatInput.scrollHeight;
async function fetchApiKey() {
    try {
        const response = await fetch('/api-key');
        const data = await response.json();
        return String(data.apiKey);
    } catch (error) {
        console.error('Error fetching API key:', error);
        return " ";
    }
}

// Example usage
async function main() {
    const API_KEY = String(await fetchApiKey());
    if (API_KEY) {

        //const API_KEY=apikey; // Valid until Dec 1, 202
        const loadDataFromlocalstorage = () => {
            const themeColor = localStorage.getItem("theme-color");
            document.body.classList.toggle("light-mode", themeColor === "light_mode");

            themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
            const defaultText = `<div class="default-text">
    <img src="./images/iqralogo.png" alt="chatBot" height="100px" width="100px">
    <h1>Hi! User</h1>
    <p>Start the conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
    <div class="dropdown">
    <button class="dropbtn">Limitation</button>
    <div class="dropdown-content">
        <p>Its efficiency is not 100%.</p>
        <p >Sometimes,it becomes confusing</p>
        
    </div>
</div>
    </div>`;
            chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;

        };
        loadDataFromlocalstorage();

        const createElement = (html, className) => {
            const chatDiv = document.createElement("div");
            chatDiv.classList.add("chat", className);
            chatDiv.innerHTML = html;
            return chatDiv;
        };

        const getChatResponse = async (incomingChatDiv) => {
            const API_URL = "https://api.openai.com/v1/completions";
            const codeElement = document.createElement("div");

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: userText,
                    max_tokens: 2048,
                    temperature: 0.2
                })
            };

            try {
                const response = await fetch(API_URL, requestOptions);
                const data = await response.json();
                codeElement.innerText = data.choices[0].text.trim();

            } catch (error) {
                codeElement.classList.add("error");
                codeElement.innerText = "Oops! Something went wrong while retrieving the response. Please try again."
            }

            incomingChatDiv.querySelector(".typing-animation").remove();
            incomingChatDiv.querySelector(".chat-details").appendChild(codeElement);

            localStorage.setItem("all-chats", chatContainer.innerHTML);
        };




        const showTypingAnimation = () => {
            const html = `<div class="chat-content">
        <div class="chat-details">
            <img src="images/haidbot.png" alt="chatbot-image" height="60px">
            <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0s"></div>
                <div class="typing-dot" style="--delay: 0.1s"></div>
                <div class="typing-dot" style="--delay: 0.2s"></div>
            </div>
        </div>
        <span onclick="copyResponse(this)" class="material-symbols-outlined">
            content_copy
        </span>
    </div>`;
            const incomingChatDiv = createElement(html, "incoming");
            chatContainer.appendChild(incomingChatDiv);
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
            getChatResponse(incomingChatDiv);
        };

        const handleOutgoingChat = () => {
            userText = chatInput.value;
            if (!userText) return;

            const escapedText = userText
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            chatInput.value = "";
            chatInput.style.height = `${initialHeight}px`;
            const html = `<div class="chat-content">
        <div class="chat-details">
            <img src="images/user.png" alt="error" height="60px">
            <p>${escapedText}</p>
        </div>
    </div>`;

            const outgoingChatDiv = createElement(html, "outgoing");
            outgoingChatDiv.querySelector("p").textContent = userText;
            document.querySelector(".default-text")?.remove();
            chatContainer.appendChild(outgoingChatDiv);

            setTimeout(showTypingAnimation, 500);

        };

        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            localStorage.setItem("theme-color", themeButton.innerHTML);
            themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
        })
        deleteButton.addEventListener("click", () => {
            if (confirm("Are you sure to delete all the chats? ")) {
                localStorage.removeItem("all-chats");

                loadDataFromlocalstorage();
            }
        })

        chatInput.addEventListener("input", () => {
            chatInput.style.height = `${initialHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;

        })

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleOutgoingChat();
            }
        });

        sendButton.addEventListener("click", handleOutgoingChat);

        document.getElementById('send-btn').addEventListener('click', function () {
            // Calculate the Y position you want to scroll to (e.g., the bottom of the page)
            const scrollPosition = document.body.scrollHeight;

            // Scroll down to the calculated position
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth' // You can use 'auto' for instant scroll
            });
        });

        document.addEventListener('keydown', function (event) {
            // Check if the pressed key is the "Enter" key (key code 13)
            if (event.keyCode === 13) {
                // Calculate the Y position you want to scroll to (e.g., the bottom of the page)
                const scrollPosition = document.body.scrollHeight;

                // Scroll down to the calculated position
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth' // You can use 'auto' for instant scroll
                });
            }
        });

    } else {
        console.log('Failed to fetch API key');
    }
}

function copyResponse(element) {
    const chatContent = element.parentElement.querySelector('.chat-details').textContent;

    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = chatContent;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();

    document.execCommand('copy');

    document.body.removeChild(tempTextArea);

    // Hide the copy icon
    element.style.visibility = 'hidden';

    // Create a "Copied" message element
    const copiedMessage = document.createElement('span');
    copiedMessage.textContent = 'copied!';
    copiedMessage.style.fontSize = '1.0rem'; // Adjust the size as needed
    copiedMessage.style.color = 'black';
    

    // Insert the message element after the icon
    element.insertAdjacentElement('afterend', copiedMessage);
    element.style.visibility = 'hidden';
    // Remove the "Copied" message and show the copy icon after a delay
    setTimeout(() => {
        copiedMessage.remove();
        element.style.visibility = 'visible';
    }, 1000);
}



main();
