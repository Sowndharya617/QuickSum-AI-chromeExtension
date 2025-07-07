document.getElementById("summarize").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;
    resultDiv.innerHTML = '<div class="loader"></div>';

    // Get user's API key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            resultDiv.textContent = "No API key set. Click the gear icon to add one.";
            return;
        }

        // Ask content.js for page text
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, (response) => {
                if (chrome.runtime.lastError) {
                    resultDiv.textContent = "Unable to extract text. Content script not found.";
                    console.error(chrome.runtime.lastError.message);
                    return;
                }

                const text = response?.text;

                if (text) {
                    resultDiv.textContent = "Extracting text...";
                    sendToGemini(text, summaryType, geminiApiKey, resultDiv);
                } else {
                    resultDiv.textContent = "No article found.";
                }
            });
        });
    });
});


// Function to send text to Gemini 2.0 Flash
function sendToGemini(text, summaryType, apiKey, resultDiv) {
    const maxLength = 20000;
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    let prompt;
    switch (summaryType) {
        case "brief":
            prompt = `Provide a brief summary of the following article in 2-3 sentences:\n\n${truncatedText}`;
            break;
        case "detailed":
            prompt = `Provide a detailed summary of the following article, covering all main points and key details:\n\n${truncatedText}`;
            break;
        case "bullets":
            prompt = `Summarize the following article in 5-7 key points. Format each point as a line starting with "- ":\n\n${truncatedText}`;
            break;
        default:
            prompt = `Summarize the following article:\n\n${truncatedText}`;
    }

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
        resultDiv.textContent = summary;
    })
    .catch(err => {
        console.error("Error calling Gemini API:", err);
        resultDiv.textContent = "Failed to generate summary. Please try again.";
    });
}


// Copy-to-Clipboard Functionality
document.getElementById("copy-btn").addEventListener("click", () => {
    const summaryText = document.getElementById("result").innerText;

    if (summaryText && summaryText.trim() !== "") {
        navigator.clipboard
            .writeText(summaryText)
            .then(() => {
                const copyBtn = document.getElementById("copy-btn");
                const originalText = copyBtn.innerText;

                copyBtn.innerText = "Copied!";
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    }
});
