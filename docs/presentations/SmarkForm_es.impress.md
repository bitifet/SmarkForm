---
nav_exclude: true
title: SmarkForm
permalink: /presentations/SmarkForm_es.impress.html

simplicity_sample_css: |
    .row {
        padding: .5em;
    }

power_sample_css: |
    .row {
        padding: .5em;
    }

    fieldset.row {
        border: solid 1px;
        margin: 3px;
    }

    button:disabled {
        opacity: .5;
    }

usability_sample_css: |
    button[data-hotkey] {
        position: relative;
        overflow-x: display;
    }
    button[data-hotkey]::before {
        content: attr(data-hotkey);
        display: inline-block;
        position: absolute;
        top: 2px;
        left: 2px;
        z-index: 10;
        background-color: #ffd;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
        font-family: sans-serif;
        font-size: .8em;
        white-space: nowrap;
        transform: scale(1.8) translate(.1em, .1em);
    }

    .row {
        padding: .5em;
    }

    fieldset.row {
        border: solid 1px;
        margin: 3px;
    }

    button:disabled {
        opacity: .5;
    }

simplicity_example: |
    <div id="myForm$$">
        <p class="row">
            <label data-smark>Nombre:</label>
            <input data-smark='{"name":"name", "type":"input"}' type="text" />
            <button data-smark='{"action":"clear","context":"name"}'>❌</button>
        </p>
        <p class="row">
            <label data-smark>Teléfono:</label>
            <input data-smark name="phone" type="tel" />
            <button data-smark='{"action":"clear","context":"phone"}'>❌</button>
        </p>
        <p class="row">
            <label data-smark>eMail:</label>
            <input data-smark name="email" type="email" />
            <button data-smark='{"action":"clear","context":"email"}'>❌</button>
        </p>
        <p class="row">
            <button data-smark='{"action":"clear"}'>❌ Borrar</button>
            <button data-smark='{"action":"export"}'>💾 Guardar</button>
        </p>
    </div>

simplicity_notes: |
    <ul>
        <li>👉 Los elementos sin la etiqueta <i>data-smark</i> no son tenidos en cuenta.</li>
        <li class="l2">➡️  Podríamos incluso insertar tags <i>&lt;input&gt;</i> para otros widgets.</li>
        <li class="l2">📝 Los que sí la tienen son <b>TODOS</b> componentes del formulario y tienen una propiedad <i>type</i> que indica su tipo. Aunque <b>en la mayoría de los casos éste es implícito y puede omitirse</b>...</li>
        <li>👉 El HTML original es funcional y puede ser trabajado por un diseñador sin interfréncias con el código.</li>
        <li>👉 Las etiquetas (<i>&lt;label&gt;</i> funcionan sin necesidad de asignar y mapear manualmente identificadores para cada campo.</li>
        <li>👉 Los botones con la propiedad <i>action</i> son (implícitamente) componentes de tipo "trigger" que disparan <i>acciones</i> de otro componente (contexto).</li>
        <li class="l2">➡️  El contexto es, implícitamente, de entre sus componentes ancestros, el más cercano que implemente la acción especificada.</li>
        <li class="l2">➡️  El contexto puede alterarse mediante la propiedad <i>context</i> del trigger, especificando una ruta absoluta (empezando por "/") o relativa (desde el componente padre del trigger).</li>
        <li class="l2">➡️  Las rutas se construyen utilizando la propiedad "name" de los componentes, separando por "/" y pudiendo utilizar el comodín ".." para subir de nivel.</li>
    </ul>

simplicity_example_js: |
    const myForm = new SmarkForm(
        document.getElementById("myForm$$")
    );

power_example: |
    <div id="myForm$$">
        <p class="row">
            <label data-smark>Nombre:</label><input data-smark='{"name":"name"}' type="text">
            <label data-smark>Edad:</label><input data-smark='{"name":"age"}' type="number">
        </p>
        <fieldset class="row" data-smark='{"name":"conatact_data"}'>
            <button data-smark='{"action":"removeItem", "context":"phones", "target":"*", "keep_non_empty":true}' title='Limpiar vacíos'>🧹</button>
            <button data-smark='{"action":"removeItem", "context":"phones", "keep_non_empty":true}' title='Eliminar teléfono'>➖</button>
            <button data-smark='{"action":"addItem","context":"phones"}' title='Añadir teléfono'>➕ </button>
            <label data-smark>Teléfonos:</label>
            <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "min_items":0, "max_items":5, "exportEmpties": true}'>
                <li data-smark='{"role": "empty_list"}' class="row">(No dispone)</li>
                <li class="row">
                    <label data-smark>📞 </label><input type="tel" data-smark>
                    <button data-smark='{"action":"removeItem"}' title='Eliminar éste teléfono'>❌</button>
                </li>
            </ul>
            <p class="row"><label data-smark>eMail:</label>
            <input type="email" name="email" data-smark /></p>
        </fieldset>
        <p class="row">
            <button data-smark='{"action":"clear"}'>❌ Borrar</button>
            <button data-smark='{"action":"import"}'>📂 Abrir</button>
            <button data-smark='{"action":"export"}'>💾 Guardar</button>
        </p>
    </div>

power_notes:
    <ul>
        <li>👉 Interceptando los eventos adecuados, podemos, por ejemplo:</li>
        <li class="l2">➡️  Inyectar o capturar los datos (JSON) de las acciones <i>import</i> y <i>export</i>.</li>
        <li class="l2">➡️  Alterar el comportamiento de la acción <i>clear</i> para que nos solicite confirmación cuando sea pertinente.</li>
        <li>👉 Para agrupar los datos de contacto, usamos un campo de tipo <i>form</i> que devuelve JSON.</li>
        <li>👉 En lugar de un sólo teléfono hemos utilizado una lista de longitud variable.</li>
        <li class="l2">📝 Los descendientes directos de las listas son <i>plantillas</i> que cumplen un determinado <i>rol</i>. Por defecto "list_item" que es obligatorio y se utilizará para renderizar los elementos de la lista. Pero hay otros, como <i>empty_list</i>, que nos ha permitido mostrar el texto "(No dispone)" cuando la lista esté vacía.</li>
        <li class="l2">➡️  La propiedad <i>of</i> nos permite ahorrarnos el atributo <i>data-smark</i> en la plantilla <i>list_item</i> si sólo es para especficar el tipo. (📌 El tipo <i>input</i> activa el patrón <i>Singleton</i>).</li>
        <li class="l2">➡️  Con <i>min_items=0</i> y <i>max_items=5</i>, respectivamente, permitimos que la lista esté vacía y limitamos su longitud a un máximo de 5 elementos.</li>
        <li class="l2">➡️  Las propiedades <i>sortable</i> y <i>export_empties</i> permiten, a su vez, que el usuario pueda ordenar la lista arrastrando los elementos y que los que estén <i>vacíos</i> también se exporten.</li>
    </ul>

power_example_js: |
    const myForm = new SmarkForm(
        document.getElementById("myForm$$")
    );

    /* Do something on data export */
    myForm.on("AfterAction_export", ({data})=>{
        window.alert(JSON.stringify(data, null, 4));
    });

    /* Get data from somewhere on import */
    myForm.on("BeforeAction_import", async (ev)=>{
        let data = window.prompt('Fill JSON data');
        if (data === null) return void ev.preventDefault(); /* Cancelled */
        try {
            ev.data = JSON.parse(data);
        } catch(err) {
            alert(err.message);
            ev.preventDefault();
        };
    });

    /* Ask for confirmation unless form is already empty: */
    myForm.on("BeforeAction_clear", async ({context, preventDefault}) => {
        if (
            ! await context.isEmpty()        /* Form (or field) is not empty */
            && ! confirm("Descartar datos?") /* User clicked the "Cancel" button. */
        ) {
            /* Prevent default (clear form) behaviour: */
            preventDefault();
        };
    });

usability_example: |
    <div id="myForm$$">
        <button data-smark='{"action":"addItem","context":"employee","hotkey":"+"}' title='Nuevo empleado'>👥</button>
        <label data-smark>Empleados:</label>
        <div data-smark='{"type":"list","name":"employee", "min_items":0,"sortable":true}'>
            <fieldset class="row">
                <p class="row">
                    <label>Empleado</label>
                    <span data-smark='{"action":"position"}'></span>/<span data-smark='{"action":"count"}'></span>:
                    <input data-smark='{"name":"name"}' type="text" placeholder='Nombre...'>
                    <button data-smark='{"action":"removeItem","hotkey":"-"}' style='float: right;' title='Baja empleado'>🔥</button>
                </p>
                <label data-smark>📞 Teléfonos:</label>
                <ul data-smark='{"name": "phones", "of": "input", "sortable":true, "max_items":3}'>
                    <li class="row">
                        <button data-smark='{"action":"removeItem","hotkey":"-"}' title='Eliminar Teléfono'>➖</button>
                        <input type="tel" data-smark />
                        <button data-smark='{"action":"addItem","hotkey":"+"}' title='Añadir Teléfono'>➕ </button>
                    </li>
                </ul>
            </fieldset>
        </div>
        <p class="row">
            <button data-smark='{"action":"clear","hotkey":"x"}'>❌ Borrar</button>
            <button data-smark='{"action":"export","hotkey":"s"}'>💾 Guardar</button>
        </p>
    </div>

usability_notes:
    <ul>
        <li>👉 Las teclas rápidas se revelan al pulsar la tecla <kbd class="key">Ctrl</kbd> y se activan combinándolas con ésta.</li>
        <li class="l2 small-text">➡️  La <i>revelación</i>, por defecto, se hace mediante el atributo <i>data-hotkey</i> aunque <span class="gray">éste comportamiento podrá alterarse mediante la intercepción del evento</span>.</li>
        <li class="l2 small-text">➡️  De éste modo, la forma en que se muestre al usuario dicha "revelación" (pista) depende totalmente del CSS.</li>
        <li class="l2 small-text">➡️  Si hay más de un trigger con la misma tecla rápida, se activará sólo la del que esté contextualmente mas cerca al foco.</li>
        <li class="l2 small-text">➡️  Si un trigger está desactivado, su tecla rápida no se revela pero, por consistencia, tampoco "cede el paso".</li>
        <li>👉 Los controles (triggers) para añadir o quitar elementos de una lista que estén integrados déntro de éstos, no reciben el foco al navegar con tabulador <b>siempre que dispongan de tecla rápida</b>.</li>
        <li>👉 Éste ejemplo tiene dos listas anidadas que podemos reordenar simplemente arrastrando con el ratón <span class="gray">(y en el futuro también automáticamente según criterio)</span>...</li>
    </ul>
    <div class="warnbox">
        <p>⚠️  El software utilizado para ésta presentación interfiere en los eventos de teclado y ratón. Para una mejor apreciación, ver los ejemplos del Manual de SmarkForm:</p>
        <p class="l2">🔗 (<a href="https://smarkform.bitifet.net" target=_blank>https://smarkform.bitifet.net</a>).</p>
    </div>


---
<style type="text/css">
    .warnbox {
        margin-top: .5em;
        border: solid 10px #ffeeee;
        border-radius: 5px;
        padding: .4em;
        font-size: .6em;
    }
    #presentation-footer {
        position: fixed;
        bottom: 0px;
        width: 100vw;
        height: 5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1em;
        font-size: 3em;
        color: black;
        opacity: .5;
    }
    body[data-hash="/__blank__"] #presentation-footer
    , body[data-hash="/Welcome"] #presentation-footer
    , body[data-hash="/SmarkForm"] #presentation-footer
    {
        display: none;
    }
    .align-left {
        text-align: left;              /* Per assegurar l'alineació del text */
    }
    .align-right {
        text-align: right;             /* Per assegurar l'alineació del text */
    }
    .substep { opacity: 0; }
    .substep.substep-visible { opacity: 1; transition: opacity 1s; }
    h1 { font-size: 5em !important; color: black; }
    li, p { color:black; }
    li:not(.big-text) { padding-left: 2em; font-size: .8em; }
    li.l2 { padding-left: 4em; font-size: 0.7em; }
    .center { text-align: center; transform: translateX(-100px); }
    .center>div, .center>iframe { display: inline-block; }
    .center>iframe {transform: translateX(+100px); }
    .gray { color: #779977; }
    .tab-container {
        font-size: 1rem;
        max-width: initial !important;
        transform: translateX(-200px);
        width: 1100px;
    }
    .tab-content { font-size: 1.3rem; }
    div.tab-content { height: 540px; }
    div.tab-content.tab-content-preview { overflow: auto; }
    div.tab-content.tab-content-notes { font-size: 1.8em; padding: 0px 7em 2em 3em; max-height: 490px; overflow: auto; }
    div.tab-content.tab-content-notes i { color: darkblue; }
    div.tab-content.tab-content-notes li { margin-top: 1.1em; list-style-type: none; }
    div.tab-content.tab-content-notes li.l2 { margin-top: .7em; }
    div.tab-content pre.highlight { max-height: 490px; }

    #Sencillez_ejemplo div.tab-content.tab-content-html { font-size: .9em; }
    #Potencia_ejemplo div.tab-content.tab-content-html { font-size: .8em; }
    #Potencia_ejemplo div.tab-content.tab-content-js { font-size: 1em; }
    #Usabilidad_ejemplo div.tab-content.tab-content-html { font-size: .9em; }
    #Usabilidad_ejemplo div.tab-content.tab-content-css { font-size: 1em; }
    #Usabilidad_ejemplo div.tab-content.tab-content-js { font-size: 1em; }

    .big-text { font-size: 2em !important; }
    .medium-text { font-size: 1.3em !important; }
    .small-text { font-size: .6em !important; display: inline-block; transform: translateY(-.3em); }
    .shadow { text-shadow: 0px 0px 8px yellow; }
    kbd.key {
        display: inline-block;
        font-family: "Courier New", Courier, monospace;
        font-size: 0.9em;
        color: #333;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 2px 4px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
        text-shadow: 0 1px 0 #fff;
        white-space: nowrap;
    }
</style>

{% include_relative css/jekyll_styles.css.md %}


{% include components/sampletabs_ctrl.md %}

{% capture rendered_simplicity_example | raw %}
{% include components/sampletabs_tpl.md
   formId="simplicity"
   htmlSource=page.simplicity_example
   jsSource=page.simplicity_example_js
   cssSource=page.simplicity_sample_css
   notes=page.simplicity_notes
%}
{% endcapture %}

{% capture rendered_power_example | raw %}
{% include components/sampletabs_tpl.md
   formId="power"
   htmlSource=page.power_example
   jsSource=page.power_example_js
   cssSource=page.power_sample_css
   notes=page.power_notes
%}
{% endcapture %}

{% capture rendered_usability_example | raw %}
{% include components/sampletabs_tpl.md
   formId="usability"
   htmlSource=page.usability_example
   jsSource=page.power_example_js
   cssSource=page.usability_sample_css
   notes=page.usability_notes
%}
{% endcapture %}



<meta charset="utf-8" />
<meta name="viewport" content="width=1024" />
<meta name="apple-mobile-web-app-capable" content="yes" />


<link href="//fonts.googleapis.com/css?family=Open+Sans:regular,semibold,italic,italicsemibold|PT+Sans:400,700,400italic,700italic|PT+Serif:400,700,400italic,700italic" rel="stylesheet" />

<link href="css/impress-demo.css" rel="stylesheet" />
<link href="css/impress-common.css" rel="stylesheet" />



<div id="impress"
    data-transition-duration="1000"
    
    data-width="1024"
    data-height="768"
    data-max-scale="3"
    data-min-scale="0"
    data-perspective="1000"
    
    data-autoplay="0">

{% assign counter = -2000 %}

{% assign counter = counter | plus: 2000 %}
    <div id="__blank__" data-x="{{ counter }}" class="step">
        <div></div>
        <!-- Just a blank slide to avoid initial rendering problem in Firefox -->
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Welcome" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">“Atention Is All You Need”</h1>
        <div class="notes">
            <ul>
                <li>Efectivamente, falta una "t". Y ahora que prestáis atención, ya tengo lo que necesito para empezar...</li>
                <li>Esa frase es el título de un famoso Paper que, para el que no lo sepa, dió orígen a la actual revolución de IA.</li>
            </ul>
        </div>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="SmarkForm" data-x="{{ counter }}" class="step">
        <p class="center">
        <img src="{{ "../assets/SmarkForm_logo_big.png" | relative_url }}" alt="SmarkForm" />
        </p>
        <p class="center">
            <img src="https://img.shields.io/npm/v/smarkform.svg" alt="" />
            <img src="https://badgen.net/npm/dependents/smarkform" alt="" />
            <img src="https://img.shields.io/npm/dm/smarkform.svg" alt="" />
            <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="" />
        </p>
        <div class="notes">
            <ul>
                <li>...Pero hoy no vamos a hablar de IA.</li>
                <li>Hoy vamos a desinfoxificarnos (o "desiaficarnos") de tanta IA.</li>
                <li>Hoy hablaremos de Formularios Web.</li>
            </ul>
        </div>
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Smark" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">Czy jest na sali jakiś Polak?</h1>
        <div class="notes">
            <ul>
                <li>Traducción: «Algún polonés en la sala?»</li>
                <li>Pequeña broma para comentar que recientemente descubrí que "Smark" significa "moco" en Polaco.</li>
            </ul>
        </div>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Smark_explain" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">Smark = Smart + Markup</h1>
        <div class="center">
            <img class="substep" style="width: 300px;" src="assets/npm_smartform.png" alt="">
            <img class="substep" style="width: 300px;" src="assets/npm_smart-form.png" alt="">
        </div>
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Otra_libreria_de_formularios_mas" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">🥱</h1> 
        <p>&nbsp;</p>
        <h1 class="center medium-text">Otra libreria de formularios...</h1>
        <h1 class="big-text center">&nbsp;</h1> 
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Diferencias" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">🤔</h1> 
        <h1 class="center medium-text" style="color: blue;">¿Por qué SmarkForm es distinta?</h1>
        <ul style="float: left">
            <li class="substep">👌 Sencillez</li>
            <li class="substep">⚡ Potencia</li>
            <li class="substep">🫶 Usabilidad</li>
        </ul>
        <ul style="float: right">
            <li class="substep">♿ Accesibilidad</li>
            <li class="substep">🏗️ Extendibilidad</li>
            <li class="substep">🚁 Independencia</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Sencillez" data-x="{{ counter }}" class="step">
        <h1 class="medium-text">👌 Sencillez</h1>
        <ul>
            <li class="substep">👉 HTML + metadatos</li>
            <li class="substep">👉 Markup-agnostic <span class="small-text substep">(Atributo <i class="shadow">data-smark</i>)</span></li>
            <li class="substep">👉 SoC (MVC)</li>
            <li class="substep">👉 <b>Zero-Wiring</b></li>
            <li>&nbsp;</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="zero_wiring" data-x="{{ counter }}" class="step">
        <h1 class="medium-text">👉 Zero-Wiring</h1>
        <ul>
            <li class="substep">🔧 Acciones <span class="small-text">(por tipo de campo)</span></li>
            <li class="substep l2 small-text">🪛 <i>import, export, clear</i>...</li>
            <li class="substep">🔧 Disparadores <span class="small-text">(Triggers)</span></li>
            <li class="substep l2 small-text">🪛 Trigger →  Acción</li>
            <li class="substep">🔧 Contexto <span class="small-text">(Natural / Explícito)</span></li>
            <li class="substep l2 small-text">🪛 (Direccionabilidad) </li>
            <li class="substep l2 small-text">🪛 "ruta/relativa", "../superior", "/ruta/absoluta"... </li>
            <li class="substep">🔧 Objetivo o "target"</li>
            <li class="substep l2 small-text">🪛 (Implicito / Ruta o "*")</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Sencillez_ejemplo" data-x="{{ counter }}" class="step">
        <h1 class="medium-text">👌 Sencillez 👀</h1>
        {{ rendered_simplicity_example }}
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="DIY_1" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">🛠️ DIY</h1>
        <h1 class="center substep">1. Crea tu primer formulario</h1>
        <p class="small-text">&nbsp;</p>
        <ul>
            <li class="substep">🤔 Elige un proyecto</li>
            <li class="substep">👉 Elige un Stack</li>
            <li class="l2 substep">➡️  ESM / UMD.</li>
            <li class="l2 substep">➡️  NPM / GitHub / Descarga...</li>
            <li class="l2 substep">➡️  Fichero local / Servidor HTTP / CodePen...</li>
            <li class="l2 substep">➡️  Ejemplo / Boilerplate / Desde cero.</li>
            <li class="substep">🚀 Empieza!!</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="codepen" data-x="{{ counter }}" class="step">
        <div class="center">
            <img style="width: 400px;" src="assets/CodePen_QR_workshop_20241212.png" alt="https://codepen.io/pen?template=pvzbYYJ">
        </div>
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Potencia" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">⚡ Potencia</h1>
        <ul>
            <li class="substep">👉 JSON ⬆️ / ⬇️ </li>
            <li class="substep">👉 Subformularios</li>
            <li class="substep">👉 Listas dinámicas ordenables</li>
            <li class="substep gray">👉 Gestión de interdependéncia</li>
            <li class="l2 substep gray">➡️  The API Interface</li>
            <li class="substep">👉 Tipado y validación</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Potencia_ejemplo" data-x="{{ counter }}" class="step">
        <h1 class="center">⚡ Potencia 👀</h1>
        {{ rendered_power_example }}
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="DIY_2" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">🛠️ DIY</h1>
        <h1 class="center substep">2. Completa tu formulario</h1>
        <p class="small-text">&nbsp;</p>
        <ul>
            <li class="substep small-text">👉 Utiliza listas y subformularios si los necesitas.</li>
            <li class="substep small-text">👉 Dispón los controles (triggers) donde se precisen.</li>
            <li class="substep small-text">👉 Ajusta los parámetros a la funcionalidad deseada.</li>
            <li class="substep small-text">👉 Gestiona los eventos.</li>
            <li class="substep small-text">👍 Verifica que todo funcione corréctamente.</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Usabilidad" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">🫶 Usabilidad </h1>
        <ul>
            <li class="substep">👉 Navegación natural </li>
            <li class="substep">👉 Hot-keys contextuales</li>
            <li class="substep">👉 Plegado de secciones</li>
            <li class="substep">👉 <span class="gray">(Auto)</span>ordenación...</li>
            <li class="l2 substep"><span class="small-text">🔗 https://github.com/drag-drop-touch-js/dragdroptouch</span></li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Usabilidad_ejemplo" data-x="{{ counter }}" class="step">
        <h1 class="medium-text center">🫶 Usabilidad  👀</h1>
        {{ rendered_usability_example }}
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="DIY_3" data-x="{{ counter }}" class="step">
        <h1 class="big-text center">🛠️ DIY</h1>
        <h1 class="center substep">3. Mejora la Usabilidad</h1>
        <p class="small-text">&nbsp;</p>
        <ul>
            <li class="substep small-text">👉 Ajusta las teclas rápidas.</li>
            <li class="substep small-text">👉 Permite la ordenación (si procede).</li>
            <li class="substep small-text">👉 Comprueba la navegación con el teclado.</li>
            <li class="substep small-text">👉 Revisa los estilos (CSS).</li>
            <li class="substep small-text">👉 Verifica el funcionamiento en distiontos dispositivos.</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Accesibilidad" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">♿ Accesibilidad</h1>
        <ul>
            <li class="substep">👉 Máxima libertad en la maquetación.</li>
            <li class="substep">👉 Mínima intrusión en el foco.</li>
            <li class="substep gray">🚧 Todavía queda trabajo por hacer...</li>
            <li class="substep">🆘 Help!!</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Extendibilidad" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">🏗️ Extendibilidad</h1>
        <ul>
            <li class="substep">👉 Crea tus propios tipos:</li>
            <li class="l2 substep">➡️  <code class="small-text">class myType extends Smarkform.types.input { ... }</code></li>
            <li class="l2 substep">➡️  <code class="small-text">SmarkForm.createType(name, myType);</code></li>
            <li class="substep gray">💡 SmarkForm mixins:</li>
            <li class="l2 substep gray">➡️  <code class="small-text">SmarkFrom.createMixin(name, htmlsource);</code></li>
            <li class="l2 substep gray">🩹 (Mixins de plantillas PUG o similar...)</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Independencia" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text">🚁 Independencia</h1>
        <ul>
            <li class="substep">👉 Vanilla JS.</li>
            <li class="substep">👉 ES module / UMD</li>
            <li class="substep">👉 CDN / NPM / GitHub</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Futuro" data-x="{{ counter }}" class="step">
        <h1 class="center medium-text gray">🔮 Futuro</h1>
        <ul>
            <li class="substep gray">👉 &lt;select&gt;</li>
            <li class="substep gray l2">➡️  "Interdependéncia"</li>
            <li class="substep gray l2">➡️  Carga dinámica</li>
            <li class="substep gray">👉 The "API" interface</li>
            <li class="substep gray l2">➡️  <span class='small-text'>&lt;option data-src='["https:...", {...}, "POST"]'&gt;</span></li>
            <li class="substep gray l2">➡️  Adaptadores personalizados.</li>
        </ul>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Más..." data-x="{{ counter }}" class="step">
        <div class="center">
            <h1 class="big-text">➕ ❓</h1>
        </div>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="SmarkForm_Manual" data-x="{{ counter }}" class="step">
        <div class="center">
            <div>
                <a
                    style="color: darkblue;"
                    href="https://smarkform.bitifet.net"
                    target=_blank
                >👉 https://smarkform.bitifet.net</a>
            </div>
            <iframe class="substep" style="width:1200px;height:650px;margin-left:-200px;" src="https://smarkform.bitifet.net"></iframe>
        </div>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Colaborar" data-x="{{ counter }}" class="step">
        <div class="center">
            <h1 class="medium-text" style="color: red;">Cómo puedo ayudar?</h1>
        </div>
        <ul>
            <li class="substep">✊ Usándola</li>
            <li class="substep">📢 Dándola a conocer</li>
            <li class="substep">🪲 Reportando errores</li>
            <li class="substep">💡 Aportando sugerencias, peticiones...</li>
            <li class="substep">🔧 Y, por supuesto, se aceptan PRs!!</li>
        </ul>
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Thanks" data-x="{{ counter }}" class="step">
        <div style="text-align: center">
            <h1 class="medium-text">Thanks for your a<b style="color:red">tt</b>ention!!</h1>
        </div>
    </div>

{% assign counter = counter | plus: 2000 %}
    <div id="Thanks_hosts" data-x="{{ counter }}" class="step">
        <div style="text-align: center; background: white; border-radius: 20px; padding: 20px;">
            <h1 class="big-text">Grácias</h1>
            <div>
            <img class="align-left" width="380px" src="assets/QR_TechSpirit_crafters.jpg" alt="TechSpirit.org and Mallorca Software Crafters" />
            <img class="align-right" width="380px" src="assets/frssystems_logo.jpeg" alt="FRS Systems" />
            </div>
        </div>
    </div>


{% assign counter = counter | plus: 2000 %}
    <div id="Questions" data-x="{{ counter }}" class="step">
        <div class="center">
            <h1 class="big-text">Preguntas... <span style="font-size:1.5em;color:red">??</span></h1>
        </div>
    </div>


</div>


<div id="presentation-footer">
    <div class="align-left">
        https://smarkform.bitifet.net
    </div>
    <div class="align-right">
        https://techspirit.org
    </div>

</div>


<!--
    This is a UI plugin. You can read more about plugins in src/plugins/README.md.
    For now, I'll just tell you that this adds some graphical controls to navigate the
    presentation. In the CSS file you can style them as you want. We've put them bottom right.
-->
<div id="impress-toolbar_disabled"></div>

<!--
    
    Hint is not related to impress.js in any way.
    
    But it can show you how to use impress.js features in creative way.
    
    When the presentation step is shown (selected) its element gets the class of "active" and the body element
    gets the class based on active step id `impress-on-ID` (where ID is the step's id)... It may not be
    so clear because of all these "ids" in previous sentence, so for example when the first step (the one with
    the id of `bored`) is active, body element gets a class of `impress-on-bored`.
    
    This class is used by this hint below. Check CSS file to see how it's shown with delayed CSS animation when
    the first step of presentation is visible for a couple of seconds.
    
    ...
    
    And when it comes to this piece of JavaScript below ... kids, don't do this at home ;)
    It's just a quick and dirty workaround to get different hint text for touch devices.
    In a real world it should be at least placed in separate JS file ... and the touch content should be
    probably just hidden somewhere in HTML - not hard-coded in the script.
    
    Just sayin' ;)
    
-->
<div class="hint">
    <p>Use a spacebar or arrow keys to navigate. <br/>
       Press 'P' to launch speaker console.</p>
</div>
<script>
if ("ontouchstart" in document.documentElement) { 
    document.querySelector(".hint").innerHTML = "<p>Swipe left or right to navigate</p>";
}
</script>


<script src="js/impress.js"></script>
<script>
    addEventListener("DOMContentLoaded", (event) => {
        impress().init();
                
        function updateHashData() {
            // Get the current hash, remove the '#' if it exists
            const hash = window.location.hash.slice(1);

            // Update the data-hash attribute on the <body>
            document.body.setAttribute('data-hash', hash);
        }

        // Set the hash data on page load
        updateHashData();

        // Update the hash data whenever the hash changes
        window.addEventListener('hashchange', updateHashData);
                            
    });
</script>

<!--
    
    The `impress()` function also gives you access to the API that controls the presentation.
    
    Just store the result of the call:
    
        var api = impress();
    
    and you will get three functions you can call:
    
        `api.init()` - initializes the presentation,
        `api.next()` - moves to next step of the presentation,
        `api.prev()` - moves to previous step of the presentation,
        `api.goto( stepIndex | stepElementId | stepElement, [duration] )` - moves the presentation to the step given by its index number
                id or the DOM element; second parameter can be used to define duration of the transition in ms,
                but it's optional - if not provided default transition duration for the presentation will be used.
    
    You can also simply call `impress()` again to get the API, so `impress().next()` is also allowed.
    Don't worry, it won't initialize the presentation again.
    
    For some example uses of this API check the last part of the source of impress.js where the API
    is used in event handlers.
    
-->


