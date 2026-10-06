try {
    var s = eval('(function(){ return " \\ t "; })()');
    console.log("sloppy json", JSON.stringify(s), "codes", Array.from(s).map(function(c){return c.charCodeAt(0).toString(16);}).join(" "));
} catch (e) {
    console.log("sloppy err", e.message);
}
try {
    var s2 = eval('(function(){ "use strict"; return " \\ t "; })()');
    console.log("strict json", JSON.stringify(s2), "codes", Array.from(s2).map(function(c){return c.charCodeAt(0).toString(16);}).join(" "));
} catch (e) {
    console.log("strict err", e.message);
}
try {
    var s3 = eval('(function(){ "use strict"; return " \\\\ t "; })()');
    console.log("escaped json", JSON.stringify(s3), "codes", Array.from(s3).map(function(c){return c.charCodeAt(0).toString(16);}).join(" "));
} catch (e) {
    console.log("escaped err", e.message);
}
