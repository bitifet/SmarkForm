
export async function text (target, options, {parent, createChild}) {
    console.log("New text!!!!", {
        target,
        parent,
        options,
    });
    const Child = createChild(target, options);
    return;
};
