const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const audio = document.getElementById('myAudio');
const lightEffect = document.getElementById('lightEffect');

let voices = [];

// Populate the list of available voices
function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        setTimeout(populateVoiceList, 100);
    }
}

populateVoiceList();
window.speechSynthesis.onvoiceschanged = populateVoiceList;

// Speak function with support for language
function speak(text, lang = 'en-US') {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.lang = lang;  // Set the language (Hindi or English)
    text_speak.rate = 1;  // Normal rate
    text_speak.volume = 1;  // Full volume
    text_speak.pitch = 1;  // Normal pitch

    // Choose a female voice if available
    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.lang === lang);
    if (femaleVoice) {
        text_speak.voice = femaleVoice;
    } else {
        // If no female voice is found, fallback to default
        text_speak.voice = voices[0];
    }

    window.speechSynthesis.speak(text_speak);
}

// Wish function based on the time of the day
function wishMe() {
    const hour = new Date().getHours();
    const lang = 'en-US'; // Default language is English

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...", lang);
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...", lang);
    } else {
        speak("Good Evening Sir...", lang);
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...", 'en-US');
    setTimeout(wishMe, 1000);  // Added delay to ensure voices are populated
});

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

// Function to take commands and process them
function takeCommand(message) {
    const lang = 'en-US'; // Default language is English

    // Greetings (English)
    if (message.includes('hey friday') || message.includes('hello friday') || message.includes('hello') || message.includes('hay')) {
        speak("Hello, I am Friday. How may I help you BHOSDIKE chanda?", lang);
    } 
    // Opening websites
    else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...", lang);
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...", lang);
    }
    // Social media
    else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...", lang);
    } else if (message.includes("open twitter")) {
        window.open("https://twitter.com", "_blank");
        speak("Opening Twitter...", lang);
    }
    // Hindi Language Support (Greeting in Hindi)
    else if (message.includes("namaste") || message.includes("hello") || message.includes("hi")) {
        speak("नमस्ते, मैं शुक्रवार हूँ। मैं आपकी कैसे मदद कर सकता हूँ?", 'hi-IN'); // Hindi greeting
    }
    // Playing song (Hindi)
    else if (message.includes('play song')) {
        audio.play().catch(error => {
            speak("Error playing the song. Please check the audio file.", lang);
            console.error("Error playing audio:", error);
        });
        lightEffect.classList.add('active');
        setTimeout(() => {
            lightEffect.classList.remove('active');
        }, 1500); // Adjust the duration of the light effect
        speak("Playing your song.", lang);
    }
    // Translating "who is swastik" to Hindi
    else if (message.includes('who is swastik') || message.includes('who is swatik')) {
        speak("स्वातिक मेरे मालिक हैं।", 'hi-IN');  // Hindi translation
    }
    // Joke
    else if (message.includes('tell me a joke')) {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don't skeletons fight each other? They don't have the guts.",
            "क्यों कंप्यूटर को कभी ठंडा नहीं किया जा सकता? क्योंकि उसके पास बहुत सारे 'बग' होते हैं!" // Hindi joke
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(joke, lang);
    }
    // Weather-related command
    else if (message.includes('weather')) {
        speak("The weather looks clear today.", lang);
    }
    // Facts
    else if (message.includes('tell me a fact')) {
        const facts = [
            "Did you know? Honey never spoils.",
            "The Eiffel Tower can grow by up to 6 inches during hot days due to the expansion of the metal.",
            "A day on Venus is longer than a year on Venus.",
            "क्या आप जानते हैं? शहद कभी खराब नहीं होता।"  // Hindi fact
        ];
        const fact = facts[Math.floor(Math.random() * facts.length)];
        speak(fact, lang);
    }
    // Date and time
    else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time, lang);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("Today's date is " + date, lang);
    }
    // Calculator (Open native calculator app)
    else if (message.includes('calculator')) {
        window.open('calculator://', '_blank');
        speak("Opening Calculator.", lang);
    }
    // Searching something on Google
    else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
        speak("I found some information for " + message + " on Google.", lang);
    }
}
