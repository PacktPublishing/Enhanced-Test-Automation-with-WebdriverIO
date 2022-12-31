module.exports = {
    create (context) {
        return {
            Identifier(node) {
                node.specifiers && node.specifiers.forEach(specifier => {
                    if (specifier.escapedText === "setValue") {
                        if (!specifier.loc.includes("await ")) {
                            return context.report(
                                node, 
                                specifier.loc, 
                                `await keyword missing from setValue()`)
                        }
                    }
                    return null;
                });
            }
        }
    }
}