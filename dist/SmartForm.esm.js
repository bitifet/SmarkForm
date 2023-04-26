const sym_events=Symbol("Events");class Events{constructor(){const a=this;a[sym_events]=new Set;}on(a,b){const c=this;c[sym_events].has(a)||c[sym_events].set(a,[]),c[sym_events].get(a).push(b.bind(c));}emit(a,b){const c=this;if(!c[sym_events].has(a))return void console.error("".concat(c.constructor.name," has no handler for ").concat(a," action"));for(const d of c[sym_events].get(a))d(b);}}const componentTypes={};const sym_smart=Symbol("smart_component"),re_valid_typename_chars=/^[a-z0-9_]+$/i,re_has_wildcards=/[\*\?]/,wild2regex=a=>new RegExp(
"^"+a.replace(/\*+/g,".*").replace(/\?/g,".")+"$"),errors={renderError:class extends Error{
constructor(a,b,c){super("RenderError(".concat(c,"): ").concat(b)),this.code=a,this.path=c,this.stack=this.stack.split("\n").slice(2).join("\n");}},
ruleError:class extends Error{
constructor(a,b,c){super("RuleError(".concat(c,"): ").concat(b)),this.code=a,this.path=c,this.stack=this.stack.split("\n").slice(2).join("\n");}}
};
function inferType(){
return "input";
}
class SmartComponent extends Events{constructor(
a){let{property_name:c="smart",...b}=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},d=2<arguments.length?arguments[2]:void 0;super();const e=this;if(e.validName=function(){
let a=0;return function(){for(var b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];for(let a of c)if("string"==typeof a&&(a=a.trim(),a.length))return a;return "UNNAMED"+ ++a}}(),e.property_name=c,e.selector="[data-".concat(e.property_name,"]"),e.typeName=e.constructor.name,e.components=componentTypes,e.target=a,e.options=b,e.setNodeOptions(e.target,e.options),e.parent=d,!e.parent instanceof SmartComponent)throw e.renderError("INVALID_PARENT","Smart Components must have valid Smart Component parent.");e.root=null===e.parent?e:e.parent,e.parents={},e.parents[Symbol.iterator]=function*(){for(let a=e;a;)yield a,a=a.parent;},e.onRenderedTasks=[],e.children={},e.target[sym_smart]=e,e.render(),e.onRenderedTasks.forEach(a=>a()),e.onRenderedTasks=null;}
onRendered(a){
const b=this;b.onRenderedTasks?b.onRenderedTasks.push(a):a();}
getNodeOptions(a,b){
const c=this,d=(a.dataset[c.property_name]||"").trim()||null,e={...b,...(()=>{try{const a=JSON.parse(d);if("object"!=typeof a)throw new Error("NO_OBJECT");return a}catch(a){return d.match(re_valid_typename_chars)?{type:d}:{}}})()};return e.action||e.type||(e.type=inferType()),c.setNodeOptions(a,e),e}
setNodeOptions(a,b){
const c=this;a.dataset[c.property_name]=JSON.stringify(b);}
enhance(a,b){
const c=this;
let d=c.getNodeOptions(a,b);
if(d.action){
if(d.type||(d.type="action"),"action"!=d.type)throw c.renderError("WRONG_ACTION_TYPE","Actions must be of type \"action\" but \"".concat(d.type,"\" given."));delete d.name;}else if("string"!=typeof d.type)throw c.renderError("NO_TYPE_PROVIDED","Invalid SmartFom item: type is mandatory for non action elements.");
const e=c.components[d.type];if(!e)throw c.renderError("UNKNOWN_TYPE","Unimplemented SmartForm component controller: ".concat(d.type));return new e(a,d,c);
}
getComponent(a){
const b=this;return a[sym_smart]||a.parentElement.closest(b.selector)[sym_smart]||null}
getPath(){
const a=this;return [...a.parents].map(a=>a.name).reverse().join("/")
||"/"
}
find(){let a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"",b=this;
if("/"==a[0])for(;b.parent;)b=b.parent;const c=a.split("/").filter(a=>a),d=c.findIndex(a=>a.match(re_has_wildcards));
if(0<=d){const a=wild2regex(c[d]),e=c.slice(0,d).join("/"),f=c.slice(d+1).join("/"),g=b.find(e),h=Object.entries(g.children);return h.filter(b=>{let[c,d]=b;return d&&c.match(a)}).map(a=>{let[,b]=a;return b.find(f)}).flat(1/0)}
return c.reduce((a,b)=>a===void 0?null:".."==b?a.parent:a.children[b],b)}
inherittedOption(a,b){
const c=this;for(const d of c.parents)if(d.options[a]!==void 0)return d.options[a];return b}
moveTo(){
const a=this;a.target.id||(a.target.id=a.getPath()),document.location.hash=a.target.id;}
getActions(){let a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:null;
const b=this,c=[];for(const d of [...b.root.target.querySelectorAll(b.selector)].map(a=>a[sym_smart])){const e=d.getActionArgs();e&&
Object.is(e.context,b)&&(
!a||1+[a].flat().findIndex(a=>a==e.action))&&c.push(d);}return c}
getActionArgs(){}
renderError(a,b){
const c=this;return new errors.renderError(a,b,c.getPath())}
ruleError(a,b){
const c=this;return new errors.ruleError(a,b,c.getPath())}}
function createComponent(a,b){
if(componentTypes[a]!==void 0)throw new Error("Duplicate component type definition: ".concat(a));if(!(b.prototype instanceof SmartComponent))throw new Error("Bad component type implementation for: ".concat(a));componentTypes[a]=b;}function getRoots(a,b){
const c=a.parentNode,d=null===c?a=>null===a:b=>null===b||b.isSameNode(a);return [...a.querySelectorAll(b)].filter(a=>d(a.parentNode.closest(b)))}class form extends SmartComponent{render(){
const a=this;a.originalDisplayProp=a.target.style.display;for(const b of getRoots(a.target,a.selector)){const c=a.enhance(b);"action"!=c.options.type&&(c.name=a.validName(c.options.name,b.getAttribute("name")),a.children[c.name]=c);}
a.root.onRendered(()=>{a.fold({operation:!a.options.folded?"unfold":"fold"});});}
export(){
const a=this;return Object.fromEntries(Object.entries(a.children).map(a=>{let[b,c]=a;return [b,c.export()]}))}
import(){let a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};
const b=this,c=Object(a).constructor;if(c!=={}.constructor)throw b.renderError("FORM_NOT_PLAIN_OBJECT","Expected plain object for form import, ".concat(c.name," given."));return Object.fromEntries(Object.entries(b.children).map(b=>{let[c,d]=b;return [c,d.import(a[c])]}))}
isEmpty(){
const a=this;return 0>Object.values(a.children).findIndex(a=>!a.isEmpty())}
empty(){
const a=this;return a.import({})}
fold(){let{
operation:a="toggle"
}=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};const b=this,c="none"==b.target.style.display,d=!("fold"!=a)||"unfold"!=a&&!c;b.target.style.display=d?"none":b.originalDisplayProp,b.getActions("fold").forEach(a=>{const{foldedClass:b,unfoldedClass:c}=a.options;b&&a.target.classList[d?"add":"remove"](b),c&&a.target.classList[d?"remove":"add"](c);});}}class singleton extends form{render(){super.render();const a=this,b=Object.keys(a.children).length;if(1!=b)throw a.renderError("NOT_A_SINGLETON","Singleton forms are only allowed to contain exactly one"+" data field but ".concat(b," found."))}
export(){
return Object.values(super.export())[0]}
import(){let a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:"";
const b=this;return super.import(Object.fromEntries([[Object.keys(b.children)[0],a]]))}
empty(){
const a=this;a.import("");}}class list extends SmartComponent{render(){var a=Math.max;
const b=this;b.originalDisplayProp=b.target.style.display,b.min_items=a(0,"number"==typeof b.options.min_items?b.options.min_items:1),b.max_items=a(b.min_items,"number"==typeof b.options.max_items?b.options.max_items:1/0),b.children=[];const c=b.target.children.length;if(1!=c)throw b.renderError("LIST_WRONG_NUM_CHILDREN","List components must contain exactly 1 direct children, but ".concat(c," given"));if(b.itemTpl=b.target.children[0],null!==b.itemTpl.querySelector("[id]")
)throw b.renderError("LIST_CONTAINS_ID","List components are not allowed to contain elements with 'id' attribute");const d=b.getNodeOptions(b.itemTpl,{type:b.options.of||"form"
});if(b.options.of&&d.type!=b.options.of)throw b.renderError("LIST_ITEM_TYPE_MISSMATCH","List item type missmatch");return b.itemTpl.remove(),void b.root.onRendered(()=>{b.fold({operation:b.options.folded?"fold":"unfold"});for(let a=0;a<b.min_items;a++)b.addItem();0==b.min_items&&b.getActions("count").forEach(a=>a.target.innerText=b.children.length+"");})}
export(){
const a=this,b=a.inherittedOption("exportEmpties",!1)?a.children:a.children.filter(a=>!a.isEmpty());return b.map(a=>a.export())}
import(){var a=Math.min,b=Math.max;let c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];
const d=this;
!c instanceof Array&&(c=[c]);
for(let b=0;b<a(c.length,d.max_items);
b++)
d.children.length<=b&&d.addItem(),d.children[b].import(c[b]);
for(let a=b(c.length,d.min_items);a<d.children.length;)d.removeItem();
for(let a=d.children.length;a<d.min_items;a++)d.chldren[a].empty();
return c.length>d.max_items&&console.error("Max of ".concat(d.max_items," items exceeded by ").concat(c.length-d.max_items," while data loadig")),d.export()}
addItem(){let{
target:a,position:c="after",autoscroll:b
}=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};const d=this;if("after"!=c&&"before"!=c)throw d.renderError("LIST_WRONG_ADDITEM_POSITION","Invalid value for addItem() position property: ".concat(c));if(d.children.length>=d.max_items)throw d.ruleError("LIST_MAX_ITEMS_REACHED","Cannot add items over max_items boundary");const e=d.itemTpl.cloneNode(!0);let f;d.children.length?(!a&&(a="before"==c?d.children[0]
:d.children[d.children.length-1]
),d.children=d.children.map(b=>b.target.isSameNode(a.target)?"after"==c?(b.target.after(e),f=d.enhance(e,{type:"form"}),[b,f]):(b.target.before(e),f=d.enhance(e,{type:"form"}),[f,b]):b).flat().map((a,b)=>(a.name=b,a))):(d.target.appendChild(e),f=d.enhance(e,{type:"form",name:0}),d.children.push(f));d.getActions("count").forEach(a=>a.target.innerText=d.children.length+"");const g=f?"self"==b?f:"parent"==b?f.parent:null:null;g&&g.moveTo();}
removeItem(){let{
target:a,...b}=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};const c=this;let{keep_non_empty:d}=b;if(a||(a=[...c.children].reverse().find(a=>!d
||a.isEmpty()),a||(a=c.children[c.children.length-1],d=!1)),a instanceof Array)return a.map(a=>c.removeItem({target:a,...b}));if(c.children.length<=c.min_items)switch(b.failback){case"none":break;case"clear":return void a.empty();case"throw":default:throw c.ruleError("LIST_MIN_ITEMS_REACHED","Cannot remove items under min_items boundary");}d&&!a.isEmpty()||(c.children=c.children.filter(b=>!b.target.isSameNode(a.target)||(b.target.remove(),!1)).map((a,b)=>(a.name=b,a)),c.getActions("count").forEach(a=>a.target.innerText=c.children.length+""));}
isEmpty(){
const a=this;return 0>a.children.findIndex(a=>!a.isEmpty())}
empty(){
const a=this;return a.import([])}
fold(){let{
operation:a="toggle"
}=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};const b=this,c="none"==b.target.style.display,d=!("fold"!=a)||"unfold"!=a&&!c;
b.target.style.display=d?"none":b.originalDisplayProp,b.getActions("fold").forEach(a=>{const{foldedClass:b,unfoldedClass:c}=a.options;b&&a.target.classList[d?"add":"remove"](b),c&&a.target.classList[d?"remove":"add"](c);}),b.getActions(["addItem","removeItem"]).map(d?a=>a.disable():a=>a.enable());}
count(){}}class input extends SmartComponent{render(){}
export(){
const a=this;return a.target.value}
import(){let a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";
const b=this;
return b.target.value=a,b.target.value}
isEmpty(){
const a=this,b=a.export();return !b.trim().length;
}
empty(){
const a=this;a.import("");}}class action extends SmartComponent{render(){}disable(){
const a=this;a.target.disabled=!0;}
enable(){
const a=this;a.target.disabled=!1;}
getActionArgs(){
const a=this,b=[...a.parents],{action:c,for:d,to:e}=a.options;if(!c)return;
let[f,g]=c.split(":").reverse();const h=d?a.parent.find(d):b.find(a=>!(g&&a.typeName!=g)&&"function"==typeof a[f]),i=e?h.find(e)
:d?null
:b.find(a=>a.parent.target.isSameNode(h.target));if("function"!=typeof h[f])throw a.renderError("UNKNOWN_ACTION","Unimplemented action ".concat(c)+(h?" for ".concat(h.options.type):""));return {action:f,origin:a,context:h,target:i,...a.options}}}
function onActionClick(a){const b=this,c=b.getComponent(a.target),d=c.getActionArgs();if(d){
const{context:a,action:b}=d;a[b](d);}}for(const[a,b]of Object.entries({form,singleton,action,list,input}))createComponent(a,b);class SmartForm extends form{constructor(a,b){const c={...b,name:"",type:"form"};super(a,c,null
);const d=this;d.target.dataset[d.property_name]=c,d.target.addEventListener("click",onActionClick.bind(d),!0);}}export{SmartForm,createComponent};