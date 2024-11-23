import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetailInfo = () => {
  const { analysis_id } = useParams()
  const [analysisData, setAnalysisData] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`api/analysis/user/${analysis_id}/statistics`)
        setAnalysisData(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [analysis_id])

  if (loading) return <p className="text-center py-10">로딩 중...</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">분석 디테일 페이지</h1>

      {/* 분석 요약 정보 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">분석 요약 정보</h2>
        <p>
          <strong>분석 일자:</strong> {new Date(analysisData.createdAt).toLocaleDateString('ko-KR')}
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
            <strong>카테고리 1:</strong> {analysisData.result.detailed_scores.category_1}
          </li>
          <li>
            <strong>카테고리 2:</strong> {analysisData.result.detailed_scores.category_2}
          </li>
        </ul>
      </section>
    </div>
  )
}

export default DetailInfo
