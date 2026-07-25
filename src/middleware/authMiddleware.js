export const protect = (req, res, next) => {
    req.user = { id: 1, role: 'ngo_admin' };   // Mock user for testing
    next();
};
export const authorize = (roles) => (req, res, next) => next();