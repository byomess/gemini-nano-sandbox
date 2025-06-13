# Gemini Nano Playground 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Experience the power of Google's Gemini Nano on-device AI model directly in your browser!**

This playground provides a user-friendly interface to interact with the Gemini Nano Prompt API, allowing you to experiment with its capabilities without sending your data to external servers. Enjoy enhanced privacy and rapid responses, all running locally.

**[Live Demo](https://byomess.github.io/gemini-nano-playground/)** 🌐

*(Note: The live demo requires a compatible Chrome version and specific flags enabled. See [Setup for Gemini Nano](#setup-for-gemini-nano) below.)*

## ✨ Features

*   **Direct Interaction with Gemini Nano:** Send prompts and receive AI-generated responses.
*   **On-Device Processing:** Ensures privacy and speed by running the model locally in your browser.
*   **Adjustable Model Parameters:** Fine-tune `temperature` and `Top-K` settings before starting a session.
*   **Real-time Status Updates:** Monitor the model's status (initializing, downloading, ready, error).
*   **Download Progress:** Track the download of the on-device model.
*   **Stop Generation:** Interrupt the AI if needed.
*   **Responsive Design:** Works smoothly on various screen sizes.
*   **Internationalization (i18n):** Supports multiple languages with an easy-to-use language selector. (Currently: English, Portuguese, Spanish, French, German)
*   **Comprehensive Setup Guide:** A built-in modal helps users configure their browser for Gemini Nano.
*   **Copy-to-Clipboard:** Easily copy flags and commands from the setup guide.

## 🛠️ Setup for Gemini Nano

To use Gemini Nano, your browser needs specific configuration. This application includes a setup modal that guides you, but here's a summary:

1.  **Get Chrome Canary or Dev Channel:**
    *   You need **Chrome Canary (version 131+)** or **Chrome Dev**.
    *   [Download Chrome Canary](https://www.google.com/chrome/canary/)
    *   [Download Chrome Dev](https://www.google.com/chrome/dev/)

2.  **Enable Experimental Flags:**
    *   Open Chrome and navigate to `chrome://flags`.
    *   Enable the following flag:
        *   `#prompt-api-for-gemini-nano` (Set to "Enabled")
    *   Relaunch Chrome after enabling the flags.

3.  **CPU Processing (Optional - If you don't have a powerful GPU):**
    *   If you don't have a dedicated GPU with 4+ GB VRAM, enable this additional flag:
        *   `#optimization-guide-on-device-model-execution-bypass` (Set to "Enabled")
    *   This allows the model to run on your CPU, though performance might be slower.

4.  **System Requirements:**
    *   **OS:** Windows 10/11, macOS 13+, or Linux.
    *   **Storage:** At least 22 GB available for the model.
    *   **GPU:** Dedicated GPU with 4+ GB VRAM (unless CPU bypass is enabled).
    *   **Network:** An unmetered internet connection for the initial model download.

5.  **Verification:**
    *   After setup, you can open Chrome DevTools (F12), go to the Console, and run `await LanguageModel.availability()`. It should return `"available"`.
    *   You can check the model download status at `chrome://components` (look for "Optimization Guide On Device Model").

For the most up-to-date and detailed instructions, please refer to the [official Chrome AI documentation](https://developer.chrome.com/docs/ai/get-started).

## 🚀 Getting Started (Development)

To run this project locally:

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or newer recommended)
*   [pnpm](https://pnpm.io/installation) (or npm/yarn)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/byomess/gemini-nano-playground.git
    cd gemini-nano-playground
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    *(If using npm: `npm install`)*
    *(If using yarn: `yarn install`)*

### Running the Development Server

1.  **Start the Vite development server:**
    ```bash
    pnpm dev
    ```
    *(If using npm: `npm run dev`)*
    *(If using yarn: `yarn dev`)*

2.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your console).

### Building for Production

1.  **Build the application:**
    ```bash
    pnpm build
    ```
    *(If using npm: `npm run build`)*
    *(If using yarn: `yarn build`)*

    This will create a `dist` folder with the production-ready assets.

### Linting

1.  **Run ESLint:**
    ```bash
    pnpm lint
    ```
    *(If using npm: `npm run lint`)*
    *(If using yarn: `yarn lint`)*

## 💻 Technologies Used

*   **React 19:** For building the user interface.
*   **TypeScript:** For static typing and improved developer experience.
*   **Vite:** As the build tool and development server.
*   **Tailwind CSS:** For utility-first styling.
*   **i18next & react-i18next:** For internationalization.
*   **Lucide React:** For icons.
*   **ESLint:** For code linting.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and that all tests pass.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ (and AI) by [Felipe Chierice](https://byomess.github.io/docs/portfolio.html)
