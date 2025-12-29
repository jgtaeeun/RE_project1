import React, { useEffect, useState } from 'react';
import Card from './Card';
import Left from '../Compo/Left.js'
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../Compo/Footer.js';

export default function List() {
    const [cards, setCards] = useState([]);
    const location = useLocation(); // 현재 위치 정보 가져오기
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const sido = queryParams.get('sido');
    const sigungu = queryParams.get('sigungu');
    const doctor = queryParams.get('doctor');
    const person = queryParams.get('person');

    console.log('queryParams:', queryParams);
    console.log('sido:', sido);
    console.log('sigungu:', sigungu);
    console.log('doctor:', doctor);
    console.log('person:', person);

    async function fetchCards() {
        const encodedDoctor = doctor ? encodeURIComponent(doctor) : '';
        const encodedPerson = person ? encodeURIComponent(person) : '';
        let url = `http://localhost:8080/find/list?sido=${sido}&sigungu=${sigungu}`;
    
           
        if (encodedDoctor) {
            url += `&doctor=${encodedDoctor}`;
        }
        
        if (encodedPerson) {
            url += `&person=${encodedPerson}`;
        }
    
        console.log("요청 URL:", url);
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
            setCards(data["1"] || []); //기본값 빈배열
        } catch (error) {
            console.error('Failed to fetch cards', error);
        }
    };

    useEffect(() => {
        fetchCards(); 
    }, [sido, sigungu, doctor, person]);

    const handleCardClick = (cardId) => {
        navigate(`/find/card/${cardId}`); 
    };

    return (
        <div className="flex flex-col min-h-screen">
        <div className="fixed left-0 top-0 w-1/6 h-full z-10">
            <Left />
        </div>
        <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0" style={{ marginLeft: "350px" }}>
        <div className="mt-6 pt-4 pb-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">병원 목록</h2>
                <p className="text-gray-700">
                    - 자세한 정보를 보시려면 카드를 클릭하세요.
                </p>
                <div className="border-b border-gray-300 mt-5"></div>

            </div>
            {cards.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                    {cards.map(card => (
                        <Card
                            key={card.id}
                            id={card.id} 
                            name={card.name}
                            phone={card.phone}
                            onClick={() => handleCardClick(card.id)} // 클릭 시 상세 페이지로 이동
                            level={card.level} // levels 데이터를 전달
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">검색 결과가 없습니다.</p>
            )}
        </div>
        <Footer/>
    </div>
);
}