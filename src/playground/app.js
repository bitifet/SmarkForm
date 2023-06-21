import './styles.scss';
import './form.scss';
import './index.pug';


// Form instantiation:
// -------------------
window.form = new SmarkForm(
    document.querySelector("#main-form")
    , {
        autoId: true,
        onAfterAction_export({data}) {
            alert (JSON.stringify(data));
        },
        async onBeforeAction_empty({context, preventDefault}) {
            if (
                ! await context.isEmpty()
                && ! confirm("Are you sure?")
            ) preventDefault();
        },
    }
);


// List items addition/removal animation:
// --------------------------------------
form
    .onAll("addItem", function({
        newItemTarget,
        onRendered,
    }) {
        newItemTarget.classList.add("ingoing");
        onRendered(()=>{
            newItemTarget.classList.remove("ingoing")
            newItemTarget.classList.add("ongoing");
        });
    })
    .onAll("removeItem", async function({
        oldItemTarget,
        onRemmoved,
    }) {
        oldItemTarget.classList.remove("ongoing");
        oldItemTarget.classList.add("outgoing");

        // Await for transition to be finished before item removal:
        const [duration, multiplier = 1000] = window.getComputedStyle(oldItemTarget)
            .getPropertyValue('transition-duration')
            .slice(0,-1).replace("m","/1")
            .split("/")
            .map(Number)
        ;
        await new Promise(resolve=>setTimeout(
            resolve
            , duration * multiplier
        ));
    })
;



// Default prevention example:
// form.on("BeforeAction_addItem", function({preventDefault}) {
//     if (! confirm("addItem?")) preventDefault();
// });



// Unrelated playground/test backend:
// ----------------------------------

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

