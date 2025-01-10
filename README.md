# NeetLeet 🚀

![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=Docker&logoColor=white)
![Linux](https://img.shields.io/badge/-Linux-FCC624?style=flat-square&logo=linux&logoColor=black)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![pnpm](https://img.shields.io/badge/-pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)
![Puppeteer](https://img.shields.io/badge/-Puppeteer-40B5A4?style=flat-square&logo=puppeteer&logoColor=white)
![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![LeetCode](https://img.shields.io/badge/-LeetCode-FF4B00?style=flat-square&logo=leetcode&logoColor=white)

NeetLeet is a Chrome extension that integrates [NeetCode](https://neetcode.io) solutions into [LeetCode](https://leetcode.com) problem pages. It enhances your coding interview preparation by providing quick access to high-quality solutions directly from the problem page.

## **Features**

- **NeetCode Integration**: Adds a "🚀 View NeetCode Solution" button to LeetCode problem pages if a corresponding NeetCode solution exists.
- **Automatic Slug Mapping**: Automatically maps the LeetCode problem slug to the NeetCode solution URL.
- **Optimized for Chrome**: Seamless integration as a Chrome extension.
- **Efficient Performance**: Ensures the button is injected only if a valid solution exists.

## **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/nicholasadamou/neetleet.git
cd neetleet
```

### **2. Install Dependencies**
Use `pnpm` to install dependencies:
```bash
pnpm install
```

### **3. Build the Extension**
Ensure the source files are properly built for deployment:
```bash
pnpm build
```

### **4. Load the Extension**
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select the `dist/` folder from the repository.

## **Development**

### **Run Unit Tests**
To execute the unit tests:
```bash
pnpm run test:unit
```

### **Run E2E Tests**
To run end-to-end tests using Puppeteer in a Dockerized environment:
```bash
docker-compose up
```

### **Run Linting**
Ensure code quality with ESLint:
```bash
pnpm run lint
```


## **File Structure**

```plaintext
neetleet/
├── src/                     # Source code for the extension
│   ├── content.js           # Main content script
│   ├── background.js        # Background script for Chrome runtime
│   ├── manifest.json        # Chrome extension manifest
│   └── ...other files
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── e2e/                 # End-to-end tests
│   └── mocks/               # Mock files for testing
├── Dockerfile               # Dockerfile for running Puppeteer tests
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── ...other files
```

## **How It Works**

1. **Content Script**:
   - Extracts the problem slug from the current LeetCode URL.
   - Sends a message to the background script to verify if a NeetCode solution exists.

2. **Background Script**:
   - Validates the problem slug by sending a request to `https://neetcode.io/solutions/<slug>`.

3. **Button Injection**:
   - If a solution exists, a "🚀 View NeetCode Solution" button is injected into the DOM, linking to the NeetCode solution.

## **Contributing**

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a Pull Request.

## **License**

This project is licensed under the [MIT License](LICENSE).

## **Acknowledgments**

- [NeetCode](https://neetcode.io) for his excellent solutions.
- [LeetCode](https://leetcode.com) for hosting challenging coding problems.
- [Puppeteer](https://github.com/puppeteer/puppeteer) for enabling automated browser testing.

## **Contact**

For any questions or suggestions, feel free to open an issue or reach out at [nicholas.adamou@outlook.com](mailto:nicholas.adamou@outlook.com).
