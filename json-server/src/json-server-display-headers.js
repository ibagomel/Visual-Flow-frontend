module.exports = (req, res, next) => {
    console.log('===============================================================');
    console.log(JSON.stringify(req.headers));
    console.log('---------------------------------------------------------------');
    console.log(JSON.stringify(req.body));
    next();
};
