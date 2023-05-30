# 💡 SmarkForm

[![License](https://img.shields.io/badge/license-GPL--v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

SmarkForm is a powerful and effortless library for creating markup-driven and
extendable forms in web applications. It empowers designers to enhance their
form templates with advanced capabilities, such as dynamic list manipulation
and context-based interactions, without the need for complex JavaScript code.

## Features

- **Markup-driven**: Create powerful interactive forms with plain HTML (or your preferred template engine) by just adding the `data-smark` attribute to relevant tags.
- **Advanced capabilities**: Add or remove items from lists, dynamic (and reactive) options loading for dropdowns, and perform context-based actions easily.
- **Easy to use**: Leverage your existing HTML and CSS knowledge to create powerful forms without the need for extensive JavaScript coding.
- **Flexible and extendable**: Import and exports complex forms in JSON format, and develop your own component types to suit your specific needs.
- **Intuitive API**: Access every component in the form tree with simple path-style addresses or utilize built-in methods for seamless form manipulation.
- **MVC Enabled**: Complete separation between View and Controller logic.

## Try it yourself!!

You can see **SmarkForm** in action in this complete CodePen example and even
fork and play with all SmarkForm features: 

[![Test it in Codepen](doc/CodePen_preview.jpg)](https://codepen.io/bitifet/full/LYgvobZ)

## Installation

To incorporate **SmarkForm** to your project you have several alternatives:

<details>
<summary>Directly import from SkyPack CDN **(Easiest approach)**</summary>


👉 As ES module:

```javascript
import SmarkForm from "https://cdn.skypack.dev/smarkform";
```

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

Check out the documentation for detailed [usage instructions](doc/index.md), examples, and API references.


## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

Before contributing, make sure to read our [contribution guidelines](doc/contributing.md).


## License

SmartKup is licensed under the [GPL-v3 License](https://www.gnu.org/licenses/gpl-3.0.html).


# Acknowledgements

We would like to express our gratitude to the open source community for their valuable contributions and feedback.


