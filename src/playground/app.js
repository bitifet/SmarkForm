import './styles.scss';
import './form.scss';
import './index.pug';


window.form = new SmartForm(
    document.querySelector("#main-form")
    , {
        async submit({context}) {
            alert (JSON.stringify(await context.export()));
        },
        async cancel({context}) {
            if (
                ! await context.isEmpty()
                && confirm("Are you sure?")
            )  context.empty();
        },
    }
    , {autoId: true}
);


form.on("addItem", function({
    newItem,
    onRendered,
}) {
    newItem.classList.add("ingoing");
    onRendered(()=>{
        newItem.classList.remove("ingoing")
        newItem.classList.add("ongoing");
    });
});

form.on("removeItem", async function({
    oldItem,
    onRemmoved,
}) {
    oldItem.classList.remove("ongoing");
    oldItem.classList.add("outgoing");

    // Await for transition to be finished before item removal:
    const [duration, multiplier = 1000] = window.getComputedStyle(oldItem)
        .getPropertyValue('transition-duration')
        .slice(0,-1).replace("m","/1")
        .split("/")
        .map(Number)
    ;
    await new Promise(resolve=>setTimeout(
        resolve
        , duration * multiplier
    ));
});



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
exportButton.addEventListener("click", async ()=>textarea.value = (
    JSON.stringify(await form.export(), null, 4)
));
clearButton.addEventListener("click", ()=>textarea.value = "");

console.log("💡💡💡💡💡💡💡💡💡💡");
console.log("form =", window.form);
console.log("💡💡💡💡💡💡💡💡💡💡");

