// Wraps a async function and catches any error if there is any 

function wrapAsync(fn) {
    return function (req, res, next) {
       fn(req, res, next).catch(e => next(e));
    }
}

module.exports = wrapAsync;