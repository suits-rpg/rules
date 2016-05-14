export default value => {
    let p = /([\d]+)%/.exec(value);
    return p ? parseInt(p[1], 10) / 100 : numeric(value);
};

function numeric(value) {
    var out = 0;
    if (value) {
        var n = parseInt(value, 10);
        if (isNaN(n)) {
            out = value;
        } else {
            out = n;
        }
    }
    return out;
}
