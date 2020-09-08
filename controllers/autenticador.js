const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            message: 'Debes incluir un token válido en tu petición.'
        });
        return;
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.nombre = decodedToken.nombre;

    next();
};