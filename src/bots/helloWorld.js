module.exports = (message) => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(message)
            }, 3000)
        } catch (ex) {
            reject(ex.message)
        }
    })
}