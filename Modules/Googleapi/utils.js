const jwt = require('jsonwebtoken')

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

            const options = {
                expiresIn: '364d',
                issuer: process.env.FRONT_URL
            };
            try {

                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, process.env.JWT_SECRET, options);

                // Let's pass back the decoded token to the request object
                req.decoded = result;
                // We call next to pass execution to the subsequent middleware
                next();
            } catch (err) {
                result = {
                    status: false,
                    data: null,
                    message: `Authentication Failed`
                }
                res.status(401).send(result)
                // Throw an error just in case anything goes wrong with verification
                //throw new Error(err);
            }
        } else {
            result = {
                status: false,
                data: null,
                message: `Authentication error. Token required.`
            };
            res.status(401).send(result)
        }
    }
}