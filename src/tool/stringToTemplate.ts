export default str => {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, "<br />")
}