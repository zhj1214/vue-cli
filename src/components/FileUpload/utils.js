export function formatFileSize(size) {
    if (!size || isNaN(size)) {
        return 0
    }
    size = Number(size)
    if (size < 2 << 9) {
        return size + "B"
    } else if (size < 2 << 19) {
        return (size / 1024).toFixed(2) + "KB"
    } else if (size < 2 << 29) {
        return (size / (2 << 19)).toFixed(2) + "MB"
    } else if (size < 2 << 39) {
        return (size / (2 << 29)).toFixed(2) + "GB"
    }
    return "--"
}

export function formatExtName(name) {
    if (!name) return ""
    const s = name.split(".")
    if (s.length === 1) {
        return ""
    }
    return "." + s[s.length - 1]
}

export function isImage(filename) {
    const ext = formatExtName(filename)
    return [".png", ".jpg", ".gif", ".jpeg"].indexOf(ext.toLocaleLowerCase()) > -1
}