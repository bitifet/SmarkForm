
export function getRoots(target, selector){//{{{
    const parent = target.parentNode;
    const isTop = (
        parent === null ? n => n === null
        : n=>(n===null)||n.isSameNode(target)
      );
    return [
        ...target.querySelectorAll(selector)
    ].filter(
        e=>isTop(e.parentNode.closest(selector))
    );
};//}}}

export const validName = (function nameGenerator() {//{{{
    let counter = 0;
    return function(n0){
        if (typeof n0 == "string") {
            n0 = n0.trim();
            if (n0.length) return n0;
        };
        return 'UNNAMED'+(++counter);
    };
})();//}}}

