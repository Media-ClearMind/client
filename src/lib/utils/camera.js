export const startCamera = async (videoRef, setErrorMsg) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    } catch (error) {
        if (error.name === 'NotAllowedError') {
            setErrorMsg('카메라 접근이 허용되지 않았습니다.')
        } else if (error.name === 'NotFoundError') {
            setErrorMsg('사용 가능한 카메라가 없습니다.')
        } else {
            setErrorMsg('카메라 접근 중 문제가 발생했습니다.')
        }
        console.error('카메라 에러:', error)
    }
}

export const stopCamera = videoRef => {
    if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        videoRef.current.srcObject = null
    }
}

export const captureImage = videoRef => {
    if (!videoRef.current) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg')
}
