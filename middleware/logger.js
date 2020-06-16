module.exports = (format) => {
    return (req, res, next) => {
        switch(format){
            case "short":
                    console.log(`${Date.now()} ${req.method} ${req.url}`)
                break
            case "long":
                default:
                    const time = Date.now().toISOString()
                    console.log(`${time} ${req.ip} ${req.method} ${req.url}`)    
        }
        next()
    }
}