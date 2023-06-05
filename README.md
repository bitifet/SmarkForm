[![SmarkForm Logo](doc/SmarkForm_logo.jpg)](https://www.npmjs.com/package/smarkform)

<details>
<summary>Powerful while effortless Markup-driven and Extendable forms.</summary>

SmarkForm is a powerful library for creating markup-driven and extendable forms
in web applications.

SmarkForm empowers designers to enhance their form templates with
advanced capabilities, such as dynamic list manipulation and context-based
interactions, with no need to deal with complex JavaScript code.

</details>

[![npm dependents](https://badgen.net/npm/dependents/smarkform)](https://www.npmjs.com/package/smarkform?activeTab=dependents)
[![License](https://img.shields.io/badge/license-GPL--v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

## Features

<details>
<summary>✔️  <b>Markup-driven</b></summary>
<ul>
  <li>👉 Create powerful interactive forms with just plain htmL.</li>
  <li>👉 ...or (<a href="#summ_recommendations">advised</a>) use your preferred template engine.</li>
  <li>👉 Just add <code>data-smark</code> attribute to relevant tags and see the magic.</li>
</ul>
</details>

<details>
<summary>✔️  <b>Easy to use</b></summary>
<ul>
  <li>👉 Leverage your existing HTML and CSS knowledge to create powerful forms.</li>
  <li>👉 No need for extensive JavaScript coding.</li>
</ul>
</details>

<details>
<summary>✔️  <b>Advanced capabilities</b></summary>
<ul>
  <li>👉 Add or remove items from lists with optional lower and upper limits.</li>
  <li>👉 Context-based actions (no need to hard-wire context and/or target).</li>
  <li>🚧 Dynamic and reactive options loading for dropdowns (comming soon).</li>
</ul>
</details>

<details>
<summary>✔️  <b>Flexible and extendable</b></summary>
<ul>
  <li>👉 Import and export complex forms in JSON format.</li>
  <li>👉 You can even import/export any subform instead of the whole one</li>
  <li>👉 Develop your own component types to suit your specific needs.</li>
</ul>
</details>

<details>
<summary>✔️  <b>Intuitive API</b></summary>
<ul>
  <li>👉 Intuitive option names.<ul>
    <li>
      <b>Ex.:</b>
      <code>&lt;button data-smark='{action: "addItem", for: "myList"&gt;</code>
    </li>
  </ul></li>
  <li>👉 Addressable elements by easy-to-read path-style relative or absolute addresses.</li>
<ul>
</details>

<details>
<summary>✔️  <b>MVC Enabled</b></summary>
<ul>
  <li>👉 Complete separation between View and Controller logic.</li>
<ul>
</details>


## Try it yourself!!

You can see **SmarkForm** in action in this complete CodePen example and even
fork and play with all SmarkForm features: 

[![Test it in Codepen](doc/CodePen_preview.jpg)](https://codepen.io/bitifet/full/LYgvobZ)

> 👉 See also [SmarkForm Examples
> collection](https://codepen.io/collection/YyvbPz) from bare minimal to more
> complex examples in CodePen.



## Installation

To incorporate **SmarkForm** to your project you have several alternatives:

<details>
<summary>Using CDN <b>(Easiest approach)</b></summary>

👉 Import as ES module (no installation at all needed):

```javascript
import SmarkForm from "https://cdn.skypack.dev/smarkform";
```

> 🚀 Powered by [Skypack](https://www.skypack.dev/)

</details>


<details>
<summary>Installing it from NPM</summary>


👉 Execute:

```sh
npm install smarkform
```

👉  Then you can use it with your favourite bundler or pick it in your preferred
format:

```
node_modules
└── smarkform
    └── dist
        ├── SmarkForm.esm.js
        ├── SmarkForm.umd.js
        └── SmarkForm.js
```

> 📌 *SmarkForm.js* can be loaded from regular ``<script>`` tag and will export
> ``SmarkForm`` class as global variable.

</details>


<details>
<summary>Clone from GitHub</summary>

👉 Execute:

```sh
git clone git@github.com:bitifet/SmarkForm.git
```

👉 Then, like with NPM package, you will find it under *dist* directory:

```
dist
├── SmarkForm.esm.js
├── SmarkForm.umd.js
└── SmarkForm.js
```

👍 ...but you can also install dev dependencies by running ``npm install`` and then


    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "mocha",
    "pretest": "npm run build",
    "start": "node ./playground/bin/www.js"


- ``npm run build``: To build after doing some change.
- ``npm run dev``: To build and watch for any source file change and auto rebuild as needed.
- ``npm run test``: To run automated tests.
- ``npm start``: To run Express server with the playground environment.

</details>


## Usage

> 📌 For detailed usage instructions and API reference check out [SmarkForm
> Manual](doc/index.md).


<details>
<summary>Start with a simple example...</summary>

1. Write some HTML code such as this in your document:
   ```html
    <div id="myForm">
    <p>
        <b>Activity:</b>
        <input data-smark name="activity" placeholder="Activity Description">
    </p>
    <p>
        <button data-smark='{"action":"addItem","for":"participants"}'>+</button>
        <span>Participants:</span>
    </p>
    <ul data-smark='{"type":"list","name":"participants"}'>
        <li>
        <input data-smark name="name" placeholder="Name">
        <input data-smark name="phone" type="tel" placeholder="Phone number">
        <button data-smark='{"action":"removeItem"}'>-</button>
        </li>
    </ul>
    </div>
   ```

2. Add a few JavaScript code to enhance it as SmarkForm:
   ```javascript
   import SmarkForm from "https://cdn.skypack.dev/smarkform";
    
    const form = new SmarkForm(
        document.getElementById("myForm")
    );

    console.log(form);
        // Now you can capture form object from browser console and play with
        // .export() and .import() methods...
    ```

</details>

<details>
<summary>Extend it with all SmarkForm power</summary>

Bla bla bla...

</details>

<details>
<summary id="summ_recommendations">Recommendations</summary>

  * Using some template engine such as [PugJS](https://pugjs.org) to generate
    html is advised to avoid eventual chararacter interpolation issues.
    - Previous html snippet would look like as follows with as Pug template:
    ```javascript
    #myForm
        p
            b Activity:
            input(data-smark name="activity" placeholder="Activity Description")
        p
            button(data-smark={
                action: "addItem",
                for: "participants",
            }) +
            span Participants:
        ul(data-smark={
            name: "participants",
        })
            li
                input(data-smark name="name" placeholder="Name")
                input(data-smark name = "phone" type="tel" placeholder="Phone number")
                button(data-smark={
                    action: "removeItem"
                }) -
    ```

</details>

<details>
<summary>✅ See Also</summary>

  * [💾 Code Snippets and Samples](doc/index.md#-code-snippets-and-samples)

  * [💾 SmarkForm Examples collection in CodePen](https://codepen.io/collection/YyvbPz)

</details>

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

Before contributing, make sure to read our [contribution guidelines](doc/contributing.md).


## License

SmartKup is licensed under the [GPL-v3 License](https://www.gnu.org/licenses/gpl-3.0.html).


# Acknowledgements

We would like to express our gratitude to the open source community for their valuable contributions and feedback.


