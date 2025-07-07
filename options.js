document.addEventListener("DOMContentLoaded", () => {
    console.log("Options page loaded");

    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        console.log("Loaded key:", geminiApiKey);
        if (geminiApiKey) {
            document.getElementById("api-key").value = geminiApiKey;
        }
    });

    document.getElementById("save-button").addEventListener("click", () => {
        const apiKey = document.getElementById("api-key").value.trim();
        if (!apiKey) {
            console.log("No API key entered.");
            return;
        }

        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
            console.log("API key saved:", apiKey);
            document.getElementById("success-message").style.display = "block";
            setTimeout(() => window.close(), 1000);
        });
    });
});
