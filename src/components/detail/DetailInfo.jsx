import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailInfo = () => {
    const { analysis_id } = useParams() // URL에서 분석 ID를 가져옴
    const [analysisData, setAnalysisData] = useState(null)

    // 더미 데이터 (API 호출을 대신하는 더미 데이터)
    const dummyDetailData = {
        analysis_id: '12345',
        createdAt: '2024-11-23T15:38:08.338Z',
        face_analysis: {
            emotion: '행복',
            emotion_score: 85
        },
        voice_analysis: {
            stress_level: 5,
            voice_confidence: 90
        },
        result: {
            summary: '사용자는 긍정적인 감정을 나타내었으며, 스트레스 레벨은 보통 수준입니다.',
            detailed_scores: {
                category_1: 85,
                category_2: 78
            }
        }
    }

    // API에서 데이터를 불러오는 대신 더미 데이터로 설정
    useEffect(() => {
        // 실제 API 호출 대신 더미 데이터로 설정
        setAnalysisData(dummyDetailData)
    }, [analysis_id])

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-4">분석 디테일 페이지</h1>

            {/* 분석 요약 정보 */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">분석 요약 정보</h2>
                <p>
                    <strong>분석 일자:</strong>{' '}
                    {new Date(analysisData.createdAt).toLocaleDateString('ko-KR')}
                </p>
                <p>
                    <strong>주요 감정 상태:</strong> {analysisData.face_analysis.emotion}
                </p>
                <p>
                    <strong>스트레스 레벨:</strong> {analysisData.voice_analysis.stress_level}
                </p>
                <p>
                    <strong>분석 요약:</strong> {analysisData.result.summary}
                </p>
            </section>

            {/* 분석 세부 데이터 */}
            <section>
                <h2 className="text-xl font-semibold mb-3">세부 평가 점수</h2>
                <ul className="list-disc pl-5">
                    <li>
                        <strong>카테고리 1:</strong>{' '}
                        {analysisData.result.detailed_scores.category_1}
                    </li>
                    <li>
                        <strong>카테고리 2:</strong>{' '}
                        {analysisData.result.detailed_scores.category_2}
                    </li>
                </ul>
            </section>
        </div>
    )
}

export default DetailInfo
