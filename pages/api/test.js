const { JSDOM } = require("jsdom");

export default function handler(req, res) {
    const dom = new JSDOM("<html><body><h1>Hello</h1><p>World</p></body></html>");
    const document = dom.window.document;

    console.log(document.querySelector("body").children.length);
    res.send("Hello");
}
