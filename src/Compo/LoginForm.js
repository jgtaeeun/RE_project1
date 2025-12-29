import React, { useState } from 'react';
import logoImage from '../Img/Logo.png';
import './LoginForm.css'; 

export default function LoginForm({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

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
    if (name === 'email' && (!value || !value.includes('@'))) errorMsg = '유효한 이메일 주소를 입력하세요.';
    if (name === 'password' && !value) errorMsg = '비밀번호를 입력하세요.';
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: errorMsg
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach(key => validateField(key, formData[key]));

    if (Object.values(errors).some(error => error)) {
        return;
    }

    const dataToSend = {
        email: formData.email,
        password: formData.password
    };

    try {
        const response = await fetch('http://localhost:8080/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
            credentials: 'include',
        });

        console.log('Response Status:', response.status); // 상태 코드 로그
        const textResponse = await response.text(); // 텍스트 형태로 응답 받기
        console.log('Response Body:', textResponse); // 응답 본문 로그

        if (response.ok) {
            // 정상적으로 로그인 성공 처리
            onLoginSuccess(); // 로그인 성공 후 콜백 호출
        } else {
            // 오류 메시지 처리
            setLoginErrorMessage('로그인 실패 ! ' + textResponse);
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        alert('로그인 중 오류가 발생했습니다.');
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
                <label className="text-gray-800 block mb-1">email</label>
                <input
                  id="email"
                  type="email"
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
                  type="password"
                  name="password"
                  className={`w-full bg-transparent text-sm text-gray-800 border-b ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 px-2 py-3 outline-none`}
                  placeholder="비밀번호를 입력하세요."
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => validateField('password', formData.password)}
                />
                {errors.password && <span className="text-red-500 text-sm block mt-1">{errors.password}</span>}
              </div>

              <div className="mt-8">
                <button type="submit" className="w-full shadow-xl py-2.5 px-5 text-sm font-semibold tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all">
                  로그인
                </button>
                {loginErrorMessage  && <div className="mt-4 text-green-500">{loginErrorMessage }</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}