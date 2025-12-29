import React, { useState } from 'react';
import skyImage from '../Img/Sky.jpg'; // 사용할 이미지
import logoImage from '../Img/Logo.png'; // 사용할 로고

export default function Signup({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태를 관리하는 상태 변수

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validateField = (name, value) => {
    let errorMsg = null;
    switch (name) {
      case 'name':
        if (!value) errorMsg = '닉네임을 입력하세요.';
        break;
      case 'email':
        if (!value.includes('@')) errorMsg = '유효한 이메일 주소를 입력하세요.';
        break;
      case 'password':
        if (value.length < 8) errorMsg = '비밀번호는 8자 이상이어야 합니다.';
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMsg
    }));
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/signup/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.exists; // Assume the server returns { exists: true } or { exists: false }
      } else {
        throw new Error('이메일 중복 확인 실패');
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이미 등록된 이메일 주소입니다.');
      return false;
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/signup/check-username?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.exists; // Assume the server returns { exists: true } or { exists: false }
      } else {
        throw new Error('닉네임 중복 확인 실패');
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      alert('닉네임 중복 확인 실패');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    Object.keys(formData).forEach(key => validateField(key, formData[key]));

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    // Check if the checkbox is checked
    if (!isChecked) {
      alert('개인 정보 수집 및 이용에 동의해야 회원가입이 가능합니다.');
      return;
    }

    // Check if email already exists
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      alert('이미 등록된 이메일 주소입니다.');
      return;
    }

    // Check if nickname already exists
    const usernameExists = await checkUsernameExists(formData.name);
    if (usernameExists) {
      alert('이미 사용 중인 닉네임입니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name, // Use name as username
          password: formData.password, // Directly use password
          email: formData.email,
          role: 'member' // Default role
        }),
      });

      if (response.ok) {
        setSuccessMessage('회원가입이 완료되었습니다.');
        setFormData({ name: '', email: '', password: '' }); // Clear form
        setErrors({}); // Clear errors on successful signup
      } else {
        const errorData = await response.json();
        console.error('회원가입 실패:', errorData);
        alert('회원가입에 실패했습니다.');
        setSuccessMessage(''); // Ensure success message is cleared on failure
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다.');
      setSuccessMessage(''); // Ensure success message is cleared on failure
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="font-[sans-serif] relative">
          <div className="relative -mt-40 m-4">
            <form className="bg-white max-w-xl w-full mx-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-8 rounded-2xl" onSubmit={handleSubmit}>
              <div className="flex justify-center items-center mb-12">
                <img src={logoImage} alt="Logo" className="logo-image" />
              </div>
              <div>
                <label className="text-gray-800 block mb-1">닉네임</label>
                <input
                  name="name"
                  type="text"
                  className={`w-full bg-transparent text-sm text-gray-800 border-b ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 px-2 py-3 outline-none`}
                  placeholder="닉네임을 입력하세요."
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => validateField('name', formData.name)}
                />
                {errors.name && <span className="text-red-500 text-sm block mt-1">{errors.name}</span>}
              </div>

              <div className="mt-8">
                <label className="text-gray-800 block mb-1">e-mail</label>
                <input
                  id="userId"
                  type="text"
                  name="email"
                  className={`w-full bg-transparent text-sm text-gray-800 border-b ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 px-2 py-3 outline-none`}
                  placeholder="email을 입력하세요."
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => validateField('email', formData.email)}
                />
                {errors.email && <span className="text-red-500 text-sm block mt-1">{errors.email}</span>}
              </div>

              <div className="mt-8">
                <label className="text-gray-800 block mb-1">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`w-full bg-transparent text-sm text-gray-800 border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 px-2 py-3 outline-none`}
                  placeholder="비밀번호를 입력하세요."
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => validateField('password', formData.password)}
                />
                {errors.password && <span className="text-red-500 text-sm block mt-1">{errors.password}</span>}
              </div>

              <div className="flex items-center mt-8">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-3 block" style={{ fontSize: '0.8rem' }}>
                  CAREFINDER의 개인정보 수집 및 이용에 동의합니다.
                </label>
              </div>

              <div className="mt-8">
                <button type="submit" className="w-full shadow-xl py-2.5 px-5 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all">
                  회원가입
                </button>
                {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}