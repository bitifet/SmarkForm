
import assert from 'assert';
import {openFile, renderPug} from '../src/lib/test/helpers.js';


const pugSrc = (//{{{
`extends layout.pug
block mainForm
    .section
        .form-group.h1
            button.foldButton(
                data-smart={
                    action: "fold",
                    for: "company",
                    foldedClass: "folded",
                }
            )
            span Company
        div(
            data-smart={
                type: "form",
                name: "company",
            }
        )
            .form-group
                label Corporate Name
                input(
                    data-smart
                    name="company"
                    type="text"
                    placeholder="Company Name"
                )
            .form-group
                label Address
                textarea(
                    data-smart
                    name="address"
                    placeholder="Address"
                )
            .form-group
                label City,State,Zip
                input(
                    data-smart
                    name="city"
                    placeholder='City'
                    style='flex: 6'
                )
                input(
                    data-smart
                    name="state"
                    placeholder='State'
                    style='flex:1'
                )
                input(
                    data-smart
                    name="postCode"
                    placeholder='Postal Code'
                    style='flex:2'
                )
    .section
        .form-group.h2.no-wrap
            button.foldButton(
                data-smart={
                    action: "fold",
                    for: "employees",
                    foldedClass: "folded",
                }
            )
            span
                span Employees (
                span(data-smart={
                    action: "count",
                    for: "employees",
                })
                span )
            .spacer
            button(data-smart = {
                action: "addItem",
                for: "employees",
                autoscroll: "self",
            }) ➕
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                keep_non_empty: true,
            }, title="Remove last non-empty employee") ➖
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                to: "*",
                keep_non_empty: true,
            }, title="Clear all empty employee") 🧹
        .form-group.no-wrap
            .form-group(data-smart = {
                type: "list",
                exportEmpties: true,
                name: "employees",
                min_items: 0,
            })
                .form-group(data-smart={
                    exportEmpties: false
                })
                    fieldset.form-group
                        .form-group.spacer.no-wrap
                            .form-group
                                .form-group
                                    label First Name
                                    input(
                                        data-smart="input"
                                        name="name"
                                        placeholder="Name"
                                    )
                                .form-group
                                    label Last Name
                                    input(
                                        data-smart="input"
                                        name="lastName"
                                        placeholder="Surnme"
                                    )
                            .spacer
                            button(data-smart = {
                                action: "removeItem",
                            }) ➖
                        .form-group
                            +inputlist("Telephones")(
                                name="phones"
                                type="tel",
                                max_items=4,
                                placeholder="Telephone",
                                removeFailback="clear"
                            )
                            +inputlist("Emails")(
                                type="email",
                                max_items=4,
                                placeholder="Email",
                                removeFailback="clear"
                            )
        .form-group.f2.no-wrap
            .spacer
            button(data-smart = {
                action: "addItem",
                for: "employees",
                autoscroll: "elegant",
            }) ➕
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                keep_non_empty: true,
                autoscroll: "elegant",
            }, title="Remove last non-empty employee") ➖
            button(data-smart = {
                action: "removeItem",
                for: "employees",
                to: "*",
                autoscroll: "elegant",
                keep_non_empty: true,
            }, title="Clear all empty employees") 🧹
        .form-group.f1.no-wrap
            .spacer
            button(data-smart = {
                action: "cancel",
            }) ❌ Cancel
            button(data-smart = {
                action: "submit",
            }) 💾 Submit
mixin inputlist(label="Annonymous")
    .form-group
        -
            //- Acccepted attributes:
            const {
                name=label.toLowerCase(),
                min_items,
                max_items,
                removeFailback, // none / clear / throw
                ...atts // Extra attributes for inputs (placeholder, etc...)
            } = attributes;
        label= label
        div(data-smart = {
            name: name,
            type: "list",
            of: "singleton",
            min_items,
            max_items,
        })
            .form-group.no-wrap
                button(data-smart = {
                    action: "addItem",
                }) ➕
                input(data-smart)&attributes(atts)
                button(data-smart = {
                    action: "removeItem",
                    failback: removeFailback,
                }) ➖
`);//}}}

const css = (//{{{
`
*, *::after, *::before {
    box-sizing: border-box;
}

html,
body {
    height: 100vh;
    height: 100svh;
    width: 100vw;
    padding: 0;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    position: fixed;
    background:
        url("https://picsum.photos/800")
        , #888888
    ;
    background-position: center;
    background-size: cover;
}

body>* {
    position: relative;
    margin: 0px;
    overflow: scroll;
    display: flex;
    gap: 0px;
    justify-content: center;
}

.container {
    background: rgba(255, 255, 255, .6);
    padding: 1em;
    height: 100vh;
    height: 100svh;
    overflow: auto;
}

#main-form {
    margin-bottom: 10rem;
}

.container>* {
    max-width: 1024px;
}

:root {
    --tbMargin: 5px;
    --tbPadding: .3rem;
    --tbFontSize: 1.5rem;
    --ttBottom: calc(
        4 * (
            var(--tbMargin)
            + var(--tbPadding)
        )
        + var(--tbFontSize)
    );
}


#testButton {
    position: fixed;
    z-index: 10;
    bottom: var(--tbMargin);
    left: var(--tbMargin);
    padding: var(--tbPadding);
    font-size: var(--tbFontSize);
}

#test-tools.hidden {
    display: none;
}

#test-tools {
    position: fixed;
    top: 5vh;
    left: 10vw;
    right: 10vw;
    bottom: var(--ttBottom);
    text-align: right;
    display: flex;
    flex-direction: column;
}

#test-tools textarea {
    position: relative;
    margin: 0px;
    padding: 0px;
    height: 90%;
    resize: none;
}

#test-tools .buttons {
    position: relative;
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 3px;
    pointer-events: none;
}
#test-tools .buttons>* {
    pointer-events: all;
    padding: .3rem;
    font-size: 1.2rem;
}


/*
#main-form:hover .form-group {
  outline: lightblue solid 1px;
}
*/

.section {
    margin-top: 1em;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: .3em;
  align-items: flex-start;
  align-content: stretch;
  justify-content: flex-start;
  font-size: 1rem;
}

.form-group.no-wrap {
    flex-wrap: nowrap;
}

.form-group input,
.form-group textarea,
.form-group select,
.form-group>.spacer
{
    flex-grow: 5;
}

.form-group input,
.form-group textarea,
.form-group select
{
  background-color : #f0f0f0; 
  padding: .2em;
}

.form-group textarea {
   font-family: Arial, Helvetica, sans-serif;
   resize: none;
}

.form-group button {
    transform: scale(1.1, 1.1);
}

.form-group fieldset {
    margin: 1em 0px;
    padding: .5em;
    border-radius: .5em;
    position: relative;
    background: hsla(247, 11%, 82%, .7);

}

.form-group label {
  font-weight: bold;
  align-items: baseline;
}

/* Headers and Footers */

h1 {
    user-select: none;
}

.form-group.h1, .form-group.f1 {
    font-size: 1.6rem;
    font-weight: bold;
    user-select: none;
}
.form-group.h1 {
    border-bottom: solid 3px;
    margin-top: 1.5rem;
    margin-bottom: .8rem;
}
.form-group.f1 {
    border-top: solid 3px;
    margin-bottom: 1.5rem;
    margin-top: .8rem;
    padding-top: .2em;
}
.form-group.h2, .form-group.f2 {
    font-size: 1.4rem;
    user-select: none;
}
.form-group.h2 {
    border-bottom: solid 2px;
    margin-top: 1.5rem;
    margin-bottom: .8rem;
}
.form-group.f2 {
    border-top: solid 2px;
    margin-bottom: 1.5rem;
    margin-top: .8rem;
    padding-top: .2em;
}

.form-group>button {
    align-self: flex-start;
}

.foldButton {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: .2em;
  background: none;
  transition: transform .5s;
}
.foldButton:not(.folded) {
  transform: translateY(.5em) rotate(45deg);
}
.foldButton.folded {
  transform: translateY(.5em) rotate(-135deg);
}
@media (hover:hover) {
    .foldButton.folded:hover {
        transform: translateY(.5em) rotate(45deg);
    }
    .foldButton:not(.folded):hover {
        transform: translateY(.5em) rotate(-135deg);
    }
}


.form-group .ingoing {
    transform: scaleY(0) translateY(-50%);
}

.form-group .ongoing {
    transition:
        transform 1ms ease-in
    ;
}

.form-group .outgoing {
    transform: scaleY(0) translateY(-50%);
    transition:
        transform 1ms ease-out
    ;
}

@media (hover:hover) {
    .form-group button:not(.foldButton):not([disabled]):hover {
            transform: translate(3px, 3px);
    }
}

@media (orientation: portrait) {
    .form-group button {
        font-size: 1.1rem !important;
    }
}

`);//}}}

const js = (//{{{
`
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
`);//}}}




describe('Initial test tinkering (temporary) over playground', function() {
    let browser, page, onClosed;

    before(async () => {
        0, {browser, page, onClosed} = await renderPug({
            title: this.title,
            src: pugSrc,
            css,
            js,
            ///headless: false,
        });
    });

    after(async () => {
        await browser.close();
        if (onClosed) await onClosed();
    });


    it('Document loaded', async () => {
        const pageTitle = await page.title();
        assert.strictEqual(pageTitle, this.title);
    });

    it('Stylesheet applied', async () => {
        const bodyPosition = await page.$eval('body', el => window.getComputedStyle(el).getPropertyValue("position"));
        assert.strictEqual(bodyPosition, 'fixed');
    });

    it('Basic introspection works', async () => {
        const form_obj = await page.evaluate(
                async () =>    form.find("company").getPath()
        );
        assert.strictEqual(form_obj, '/company');
    });

    it('Lists addItem action works', async () => {
        const listLength = await page.evaluate(async () => {
                const list = form.find("employees");
                await list.addItem();
                await list.addItem();
                await list.addItem();
                return list.count();
        });
        assert.strictEqual(listLength, 3);
    });

    it('Lists removeItem action works', async () => {
        const listLength = await page.evaluate(async () => {
                const list = form.find("employees");
                await list.removeItem();
                return list.count();
        });
        assert.strictEqual(listLength, 2);
    });

});

