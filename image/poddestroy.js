import { createServer } from 'http';
import os from 'os';
import express from 'express';

const port = process.env.PORT || 3000;


// Array of HTML fragments (no DOM manipulation needed)
const surprises = [
    `<h2>💣 Click to destroy!</h2>
  <button onclick="destroyPod()" style="font-size:20px;padding:10px;background:red;color:white;border:none;cursor:pointer;">💀 DESTROY POD NOW 💀</button>
  <script>
    function destroyPod() {
      document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 DESTROYING POD... 💀</div>';
      console.log('Sending destroy request...');
      fetch('/destroy', {method: 'POST'})
        .then(response => {
          console.log('Destroy response:', response.status);
          document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 POD DESTROYED 💀</div>';
        })
        .catch(error => {
          console.error('Destroy failed:', error);
          // Fallback - still try to show destruction
          document.body.innerHTML = '<div style="background:black;color:red;font-size:50px;text-align:center;padding-top:200px;">💀 POD DESTROYED 💀</div>';
        });
    }
  </script>`
];


//Style from env variables
const backgroundColor = process.env.BG_COLOR || 'white';
const fontColor = process.env.FONT_COLOR || 'black';
const borderSize = process.env.BORDER_SIZE || '2px';
const borderStyle = process.env.BORDER_STYLE || 'dashed';
const borderColor = process.env.BORDER_COLOR || '#ccc';

function renderPage(surpriseContent) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>KubeChaos @ RSECon25</title>
  <style>
    body { font-family: 'sans-serif'; text-align: center; margin-top: 5rem; background-color: ${backgroundColor};
    color: ${fontColor};}
    #playground { height: 400px; border: ${borderSize} ${borderStyle} ${borderColor}; margin-top: 20px; }
    button { padding: 10px 20px; font-size: 1rem; cursor: pointer; }
  </style>
  <link rel="stylesheet" href="/style.css" >
</head>
<body>
  <h1>KubeChaos @ RSECon25!</h1>
  <p>Served by pod: <strong>${os.hostname()}</strong></p>
  <p>Every refresh brings a new surprise 🎲</p>
  <div id="playground">
    ${surpriseContent}
  </div>
</body>
</html>
`;
};
const server = express();

server.use(express.static('public'));

server.get('/', (req, res) => {
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    res.set("Cache-Control", "no-cache, no-store");
    res.set("Content-Type", "text/html");
    res.send(renderPage(randomSurprise));
});

server.post("/destroy", (req, res) => {
    console.log("💀💀💀 DESTRUCTION ENDPOINT HIT! 💀💀💀");
    res.status(200).json({ message: "Pod is being destroyed!" });
    console.log("🔥 KILLING PROCESS NOW...");

    // Multiple ways to ensure the process dies
    setTimeout(() => {
        console.log("💥 PROCESS.EXIT(1)");
        process.exit(1);
    }, 100);

    setTimeout(() => {
        console.log("💥 PROCESS.EXIT(143) - SIGTERM");
        process.exit(143);
    }, 200);

    setTimeout(() => {
        console.log("💥 THROWING UNCAUGHT EXCEPTION");
        throw new Error("INTENTIONAL CRASH FOR KUBERNETES EXPERIMENT");
    }, 300);
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});