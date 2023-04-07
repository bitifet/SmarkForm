
export async function list (target, options, {parent, createChild}) {
    console.log("New list!!!!", {
        target,
        parent,
        options,
    });
    const Child = createChild(target, options);
    return;
};

