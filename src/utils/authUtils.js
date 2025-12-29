// src/utils/authUtils.js
import React from 'react';
import { FaRegSmile } from "react-icons/fa";

export const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:8080/checkSession', {
        credentials: 'include', // 세션 쿠키를 포함
      });
  
      if (response.ok) {
        const data = await response.json();
        return {
          loggedIn: true,
          username: data.username,
          email: data.email,
          role: data.role,
          message: (
            <span style={{ display: 'inline-flex', alignItems: 'center', color: 'white', fontSize: '0.9rem'  }}>
            {data.username}님, 반갑습니다!
            <FaRegSmile style={{ marginLeft: '0.6rem' }} />
          </span>
          )
        };
      } else if (response.status === 401) {
        return {
          loggedIn: false,
          username: null,
          role: null,
          message: '로그인 정보가 없습니다. 다시 로그인 해주세요.',
        };
      } else {
        return {
          loggedIn: false,
          username: null,
          role: null,
          message: '세션 확인 중 문제가 발생했습니다.',
        };
      }
    } catch (error) {
      console.error('세션 확인 실패:', error);
      return {
        loggedIn: false,
        username: null,
        role: null,
        message: '세션 확인 중 오류가 발생했습니다.',
      };
    }
  };
  