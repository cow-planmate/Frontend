import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, FileText } from 'lucide-react';

type CreatePostProps = {
  onBack: () => void;
};

type ScheduleItemInput = {
  id: string;
  time: string;
  location: string;
  description: string;
  note: string;
};

export function CreatePost({ onBack }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItemInput[]>([
    { id: '1', time: '09:00', location: '', description: '', note: '' },
  ]);

  const tags = [
    { id: 'walking', label: '👟 뚜벅이최적화' },
    { id: 'j-type', label: '⚡ 극한의J' },
    { id: 'p-type', label: '☕ 여유로운P' },
    { id: 'optimal', label: '🎯 동선낭비없는' },
  ];

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const addScheduleItem = () => {
    const newId = (scheduleItems.length + 1).toString();
    setScheduleItems([
      ...scheduleItems,
      { id: newId, time: '', location: '', description: '', note: '' },
    ]);
  };

  const removeScheduleItem = (id: string) => {
    setScheduleItems(scheduleItems.filter((item) => item.id !== id));
  };

  const updateScheduleItem = (id: string, field: keyof ScheduleItemInput, value: string) => {
    setScheduleItems(
      scheduleItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = () => {
    alert('게시글이 등록되었습니다! 🎉');
    onBack();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="font-bold text-lg text-gray-900">여행기 작성</h1>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Helper Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                💡 쉽게 작성하는 방법
              </h3>
              <p className="text-sm text-gray-700">
                보관함에서 시간표를 불러오거나, 아래에서 일정을 직접 추가하세요. 각 장소에 짧은 코멘트만 달면 끝!
              </p>
            </div>
          </div>
        </div>

        {/* Import from Library */}
        <div className="mb-6">
          <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="font-semibold text-gray-700">내 보관함에서 시간표 불러오기</p>
            <p className="text-sm text-gray-500">저장된 일정을 불러와 바로 공유하세요</p>
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">또는 직접 작성</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 부산 뚜벅이 3박 4일 완벽 코스"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                지역 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 부산"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                기간 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="예: 3박 4일"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">태그</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">여행 소개</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 여행 코스에 대해 간단히 소개해주세요"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              상세 일정 <span className="text-red-500">*</span>
            </h2>
            <button
              onClick={addScheduleItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              일정 추가
            </button>
          </div>

          <div className="space-y-4">
            {scheduleItems.map((item, index) => (
              <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(item.id, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => updateScheduleItem(item.id, 'location', e.target.value)}
                      placeholder="장소명"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => updateScheduleItem(item.id, 'description', e.target.value)}
                      placeholder="활동 내용"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) => updateScheduleItem(item.id, 'note', e.target.value)}
                      placeholder="💡 꿀팁 (선택사항): 예시 - 여기 웨이팅 김"
                      className="w-full px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  {scheduleItems.length > 1 && (
                    <button
                      onClick={() => removeScheduleItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button (Desktop) */}
        <div className="mt-8 pb-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            게시글 등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
