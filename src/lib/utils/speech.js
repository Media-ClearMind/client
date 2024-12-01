export const stopRecognition = (recognition, setRecognition) => {
    if (recognition) {
        recognition.stop()
        setRecognition(null)
    }
}

export const handleRecognition = (recognition, setCurrentAnswer, updateStatus, setRecognition) => {
    recognition.onstart = () => {
        updateStatus('🎤 듣고 있습니다...', 'normal', true)
    }

    recognition.onresult = event => {
        const text = event.results[0][0].transcript
        if (text.trim()) {
            setCurrentAnswer(text)
            updateStatus('답변이 완료되었습니다.', 'success')
        } else {
            handleNoSpeech(updateStatus)
        }
    }

    recognition.onerror = event => {
        handleNoSpeech(updateStatus)
    }

    recognition.onend = () => {
        handleNoSpeech(updateStatus)
    }

    setRecognition(recognition)
    recognition.start()
}

export const handleNoSpeech = updateStatus => {
    updateStatus('답변이 정확히 인식되지 않았습니다. 다시 시도해주세요.', 'error')
}
