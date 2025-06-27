const MemberInfo = () => (
  <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
      Thông tin cơ bản
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value="user@email.com"
          disabled
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Họ và tên
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value="Nguyễn Văn A"
          disabled
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Ngày sinh
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value="01/01/1990"
          disabled
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Địa chỉ</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value="Hà Nội"
          disabled
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Số điện thoại
        </label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          value="0123456789"
          disabled
        />
      </div>
    </div>
  </div>
);

export default MemberInfo;
