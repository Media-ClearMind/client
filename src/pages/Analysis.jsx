import React, { useEffect, useRef, useState } from 'react';

import { fetchData } from '@/lib/api/util'; // fetchData 유틸 함수

const VoiceChat = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [recognition, setRecognition] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [status, setStatus] = useState({ message: '시작 버튼을 눌러주세요', type: 'normal' });
    const [isStarted, setIsStarted] = useState(false);
    const [responses, setResponses] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const videoRef = useRef(null);

    const questions = [
        '오늘 기분은 어떠신가요?',
        '주말에는 주로 무엇을 하시나요?',
        '가장 좋아하는 음식은 무엇인가요?'
    ];

    const startCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setErrorMsg('이 브라우저는 카메라를 지원하지 않습니다.');
            console.error('mediaDevices 또는 getUserMedia가 지원되지 않습니다.');
            return;
        }
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setErrorMsg('');
            }
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                setErrorMsg('카메라 접근이 허용되지 않았습니다.');
            } else if (error.name === 'NotFoundError') {
                setErrorMsg('사용 가능한 카메라가 없습니다.');
            } else {
                setErrorMsg('카메라 접근 중 문제가 발생했습니다.');
            }
            console.error('카메라 에러:', error);
        }
    };
    

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (isFinished) {
            stopCamera();
        }
    }, [isFinished]);

    const updateStatus = (message, type = 'normal', isListening = false) => {
        setStatus({ message, type, isListening });
    };

    const speak = text => {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.onend = resolve;
            updateStatus(`🔊 말하는 중: ${text}`);
            speechSynthesis.speak(utterance);
        });
    };

    const stopRecognition = () => {
        if (recognition) {
            recognition.stop();
            setRecognition(null);
        }
    };

    const listen = async () => {
        stopRecognition();

        return new Promise((resolve, reject) => {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const newRecognition = new SpeechRecognition();
                newRecognition.lang = 'ko-KR';
                newRecognition.interimResults = false;
                newRecognition.maxAlternatives = 1;

                let isAnswered = false;

                newRecognition.onstart = () => {
                    updateStatus('🎤 듣고 있습니다...', 'normal', true);
                };

                newRecognition.onresult = event => {
                    const text = event.results[0][0].transcript;
                    if (text.trim()) {
                        setCurrentAnswer(text);
                        isAnswered = true;
                        updateStatus('답변이 완료되었습니다.', 'success');
                        resolve(text);
                    } else {
                        handleNoSpeech();
                        reject(new Error('음성이 인식되지 않았습니다'));
                    }
                };

                newRecognition.onerror = event => {
                    handleNoSpeech();
                    reject(new Error(`음성 인식 오류: ${event.error}`));
                };

                newRecognition.onend = () => {
                    if (!isAnswered) {
                        handleNoSpeech();
                    }
                };

                setRecognition(newRecognition);
                newRecognition.start();
            } catch (err) {
                reject(new Error('음성 인식을 시작할 수 없습니다'));
            }
        });
    };

    const handleNoSpeech = () => {
        updateStatus('답변이 정확히 인식되지 않았습니다. 다시 시도해주세요.', 'error');
    };

    const retry = async () => {
        setCurrentAnswer(null);
        updateStatus('다시 답변을 시도합니다.');
        await listen();
    };

    const captureImage = () => {
        if (!videoRef.current) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg'); // Base64로 변환
    };

    const sendImageToServer = async (image, count) => {
        try {
            const userId = localStorage.getItem('userId'); // 로컬스토리지에서 userId 가져오기
            const url = `${import.meta.env.VITE_API_URL}/analyze`;

            const response = await fetchData({
                url,
                method: 'POST',
                body: {
                    image,
                    count,
                    userId
                }
            });

            console.log('Server response:', response);
        } catch (error) {
            console.error('Error sending image to server:', error);
        }
    };

    const handleNextQuestion = async () => {
        stopRecognition();

        if (currentAnswer) {
            setResponses(prev => [
                ...prev,
                {
                    question: questions[currentStep],
                    answer: currentAnswer
                }
            ]);
            setCurrentAnswer(null);
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
            await startQuestion(currentStep + 1);
        } else {
            updateStatus('모든 대화가 완료되었습니다.', 'success');
            setIsFinished(true);
            setIsStarted(false);
        }
    };

    const startQuestion = async stepIndex => {
        try {
            const image = captureImage(); // 질문 시작 시 이미지 캡처

            await speak(questions[stepIndex]);
            await listen();

            await sendImageToServer(image, stepIndex + 1); // 서버로 이미지와 count 전송
        } catch (error) {
            console.error('Question error:', error);
        }
    };

    const startConversation = async () => {
        try {
            setResponses([]);
            setCurrentStep(0);
            setCurrentAnswer(null);
            setIsStarted(true);
            setIsFinished(false);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());

            await startQuestion(0);
        } catch (error) {
            console.error('Conversation error:', error);
            updateStatus(`오류가 발생했습니다: ${error.message}`, 'error');
            setIsStarted(false);
        }
    };

    if (isFinished) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-full max-w-3xl p-6 bg-white rounded-lg">
                    <h1 className="text-2xl font-bold mb-4 text-center">대화 결과</h1>
                    {responses.map((response, index) => (
                        <div
                            key={index}
                            className="my-4 p-4 bg-gray-100 rounded-lg">
                            <div className="font-bold text-gray-600">Q: {response.question}</div>
                            <div className="text-gray-800 mt-1">A: {response.answer}</div>
                        </div>
                    ))}
                    <button
                        onClick={startConversation}
                        className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:opacity-90 transition">
                        다시 시작하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="w-full max-w-3xl bg-gray-200 h-2 mt-4 mx-auto rounded">
                <div
                    className="bg-blue-600 h-2 rounded transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="flex flex-col justify-center items-center flex-grow">
                <div className="w-full max-w-3xl p-6 bg-white rounded-lg">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        <h1 className="text-xl font-bold">음성 대화 테스트</h1>
                        <div>
                            {currentStep + 1} / {questions.length}
                        </div>
                    </div>

                    {!isStarted ? (
                        <button
                            onClick={startConversation}
                            className="w-full py-3 mb-4 bg-black text-white rounded-lg hover:opacity-90 transition">
                            대화 시작
                        </button>
                    ) : (
                        <>
                            <p className="text-center text-lg mb-4">{questions[currentStep]}</p>
                            {!currentAnswer && (
                                <button
                                    onClick={retry}
                                    className="w-full py-3 mb-4 bg-red-600 text-white rounded-lg hover:opacity-90 transition">
                                    다시 답변하기
                                </button>
                            )}
                            <button
                                onClick={handleNextQuestion}
                                className={`w-full py-3 mb-4 ${
                                    currentStep === questions.length - 1
                                        ? 'bg-green-600 hover:opacity-90'
                                        : 'bg-blue-600 hover:opacity-90'
                                } text-white rounded-lg transition`}>
                                {currentStep === questions.length - 1
                                    ? '결과 보기'
                                    : '다음 질문으로'}
                            </button>
                        </>
                    )}

                    <div
                        className={`text-center p-4 rounded ${
                            status.type === 'error'
                                ? 'bg-red-100 text-red-600'
                                : status.type === 'success'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                        {status.message}
                    </div>

                    {/* 카메라 화면 */}
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mt-4">
                        {errorMsg && (
                            <div className="absolute inset-0 flex items-center justify-center text-red-500">
                                {errorMsg}
                            </div>
                        )}
                        <video
                            ref={videoRef}
                            className="w-full h-[400px] object-cover transform scale-x-[-1]"
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceChat;
