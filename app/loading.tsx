export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <div className="text-xl font-semibold text-gray-900 mb-2">GigFlow</div>
        <div className="text-sm text-gray-600">Loading your curated opportunities...</div>
      </div>
    </div>
  );
}
