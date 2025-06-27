import { useState } from 'react';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
        Đổi mật khẩu
      </h2>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Mật khẩu cũ
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Mật khẩu mới
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Nhập lại mật khẩu mới
        </label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-blue-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow transition"
      >
        Đổi mật khẩu
      </button>
    </form>
  );
};

export default ChangePassword;
