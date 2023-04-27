
import {SmartForm} from "./SmartForm.esm.js";

window.form = new SmartForm(
    document.querySelector("#main-form")
    , {
        submit({context}) {
            alert (JSON.stringify(context.export()));
        },
        cancel({context}) {
            if (
                ! context.isEmpty()
                && confirm("Are you sure?")
            )  context.import();
        },
    }
);


const testTools = document.querySelector("#test-tools");
const testButton = document.querySelector("#testButton");
const importButton = document.querySelector("#importButton");
const exportButton = document.querySelector("#exportButton");
const clearButton = document.querySelector("#clearButton");
const textarea = document.querySelector("#inoutJson");


testButton.addEventListener("click", ()=>testTools.classList.toggle("hidden"));

importButton.addEventListener("click", ()=>form.import(
    JSON.parse(textarea.value.trim() || '{}'))
);
exportButton.addEventListener("click", ()=>textarea.value = (
    JSON.stringify(form.export(), null, 4)
    + "\n\n\n\n\n\n\n\n" // CSS laziness ;-)
));
clearButton.addEventListener("click", ()=>textarea.value = "");

console.log("💡💡💡💡💡💡💡💡💡💡");
console.log("form =", window.form);
console.log("💡💡💡💡💡💡💡💡💡💡");

