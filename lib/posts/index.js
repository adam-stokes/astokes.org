"use strict";

import Parse from "genc-parse";
import _ from "lodash";

let items = {};

Parse(__dirname).then((posts) => {
    _.each(posts, (p) => {
        items[p.permalink] = p;
    });
    return items;
});

export default items;
