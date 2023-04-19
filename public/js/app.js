
import {SmartForm} from "./SmartForm.js";

window.form = new SmartForm(
    document.querySelector("#main-form")
);

const importButton = document.querySelector("#importButton")
const exportButton = document.querySelector("#exportButton")
const clearButton = document.querySelector("#clearButton")
const textarea = document.querySelector("#inoutJson")


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

