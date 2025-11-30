import { useState, FormEvent } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../components/LanguageToggle';
import { api } from '../services/api';

interface Question {
  id: number;
  question: string;
  questionKn: string;
  options: { text: string; textKn: string; score: number }[];
}

export const SelfAssessment = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [result, setResult] = useState<{ score: number; riskLevel: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'Do you have a persistent cough?',
      questionKn: 'ನಿಮಗೆ ನಿರಂತರ ಕೆಮ್ಮು ಇದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Mild', textKn: 'ಸ್ವಲ್ಪ', score: 1 },
        { text: 'Moderate', textKn: 'ಮಧ್ಯಮ', score: 2 },
        { text: 'Severe', textKn: 'ತೀವ್ರ', score: 3 },
      ],
    },
    {
      id: 2,
      question: 'Are you experiencing shortness of breath?',
      questionKn: 'ನೀವು ಉಸಿರಾಟದ ತೊಂದರೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಾ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Mild', textKn: 'ಸ್ವಲ್ಪ', score: 2 },
        { text: 'Moderate', textKn: 'ಮಧ್ಯಮ', score: 3 },
        { text: 'Severe', textKn: 'ತೀವ್ರ', score: 4 },
      ],
    },
    {
      id: 3,
      question: 'Do you have chest pain when breathing or coughing?',
      questionKn: 'ಉಸಿರಾಟ ಅಥವಾ ಕೆಮ್ಮುವಾಗ ಎದೆ ನೋವು ಇದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Mild', textKn: 'ಸ್ವಲ್ಪ', score: 2 },
        { text: 'Moderate', textKn: 'ಮಧ್ಯಮ', score: 3 },
        { text: 'Severe', textKn: 'ತೀವ್ರ', score: 4 },
      ],
    },
    {
      id: 4,
      question: 'Do you have a fever?',
      questionKn: 'ನಿಮಗೆ ಜ್ವರ ಇದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Low (99-100°F)', textKn: 'ಕಡಿಮೆ', score: 1 },
        { text: 'Medium (100-102°F)', textKn: 'ಮಧ್ಯಮ', score: 2 },
        { text: 'High (>102°F)', textKn: 'ಹೆಚ್ಚು', score: 3 },
      ],
    },
    {
      id: 5,
      question: 'Are you experiencing fatigue or weakness?',
      questionKn: 'ನೀವು ಆಯಾಸ ಅಥವಾ ದೌರ್ಬಲ್ಯವನ್ನು ಅನುಭವಿಸುತ್ತಿದ್ದೀರಾ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Mild', textKn: 'ಸ್ವಲ್ಪ', score: 1 },
        { text: 'Moderate', textKn: 'ಮಧ್ಯಮ', score: 2 },
        { text: 'Severe', textKn: 'ತೀವ್ರ', score: 3 },
      ],
    },
    {
      id: 6,
      question: 'Do you have night sweats?',
      questionKn: 'ನಿಮಗೆ ರಾತ್ರಿ ಬೆವರು ಇದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Mild', textKn: 'ಸ್ವಲ್ಪ', score: 1 },
        { text: 'Moderate', textKn: 'ಮಧ್ಯಮ', score: 2 },
        { text: 'Severe', textKn: 'ತೀವ್ರ', score: 3 },
      ],
    },
    {
      id: 7,
      question: 'Are you producing phlegm or mucus when coughing?',
      questionKn: 'ಕೆಮ್ಮುವಾಗ ಕಫ ಅಥವಾ ಲೋಳೆ ಬರುತ್ತಿದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Clear', textKn: 'ಸ್ವಚ್ಛ', score: 1 },
        { text: 'Yellow/Green', textKn: 'ಹಳದಿ/ಹಸಿರು', score: 2 },
        { text: 'Blood-tinged', textKn: 'ರಕ್ತ ಬೆರೆತ', score: 4 },
      ],
    },
    {
      id: 8,
      question: 'Do you have difficulty sleeping due to respiratory symptoms?',
      questionKn: 'ಉಸಿರಾಟದ ಲಕ್ಷಣಗಳಿಂದ ನಿದ್ರೆಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Sometimes', textKn: 'ಕೆಲವೊಮ್ಮೆ', score: 1 },
        { text: 'Often', textKn: 'ಆಗಾಗ್ಗೆ', score: 2 },
        { text: 'Always', textKn: 'ಯಾವಾಗಲೂ', score: 3 },
      ],
    },
    {
      id: 9,
      question: 'Have you been in contact with someone diagnosed with pneumonia?',
      questionKn: 'ನ್ಯುಮೋನಿಯಾ ರೋಗಿಯೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿದ್ದೀರಾ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Not sure', textKn: 'ಖಚಿತವಿಲ್ಲ', score: 1 },
        { text: 'Yes, recently', textKn: 'ಹೌದು, ಇತ್ತೀಚೆಗೆ', score: 3 },
        { text: 'Yes, living with', textKn: 'ಹೌದು, ಒಟ್ಟಿಗೆ ವಾಸ', score: 4 },
      ],
    },
    {
      id: 10,
      question: 'Do you have any existing respiratory conditions?',
      questionKn: 'ನಿಮಗೆ ಯಾವುದೇ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಉಸಿರಾಟದ ಸಮಸ್ಯೆಗಳಿವೆಯೇ?',
      options: [
        { text: 'No', textKn: 'ಇಲ್ಲ', score: 0 },
        { text: 'Asthma', textKn: 'ಆಸ್ಥಮಾ', score: 2 },
        { text: 'COPD', textKn: 'COPD', score: 3 },
        { text: 'Other chronic condition', textKn: 'ಇತರ ದೀರ್ಘಕಾಲೀನ', score: 2 },
      ],
    },
  ];

  const handleAnswerChange = (questionId: number, score: number) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    let riskLevel = '';
    if (percentage < 30) riskLevel = t('selfAssessment.low');
    else if (percentage < 60) riskLevel = t('selfAssessment.moderate');
    else riskLevel = t('selfAssessment.high');

    const assessmentData = {
      answers: questions.map((q) => ({
        question: language === 'en' ? q.question : q.questionKn,
        answer: q.options.find((opt) => opt.score === answers[q.id])?.text || '',
        score: answers[q.id] || 0,
      })),
      totalScore,
      riskLevel,
    };

    try {
      await api.submitSelfAssessment(assessmentData, user!.token);
      setResult({ score: totalScore, riskLevel });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-5"></div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <ClipboardList size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('selfAssessment.title')}</h1>
              <p className="text-gray-600">{t('selfAssessment.subtitle')}</p>
            </div>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {question.id}. {language === 'en' ? question.question : question.questionKn}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.score}
                          onChange={() => handleAnswerChange(question.id, option.score)}
                          className="w-4 h-4 text-blue-600"
                          required
                        />
                        <span className="text-gray-700">
                          {language === 'en' ? option.text : option.textKn}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading || Object.keys(answers).length < questions.length}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('common.loading') : t('selfAssessment.submit')}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t('selfAssessment.results')}</h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-semibold">{t('selfAssessment.score')}:</span> {result.score}/40
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">{t('selfAssessment.riskLevel')}:</span>{' '}
                  <span
                    className={`font-bold ${
                      result.riskLevel === t('selfAssessment.high')
                        ? 'text-red-600'
                        : result.riskLevel === t('selfAssessment.moderate')
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}
                  >
                    {result.riskLevel}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Take Another Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};