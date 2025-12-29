import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Left from '../Compo/Left.js';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { PiPhoneCallBold } from "react-icons/pi";
import { checkSession } from '../utils/authUtils';

export default function CardDetail() {
    const { cardId } = useParams();
    const [cardDetails, setCardDetails] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false); //찜 상태관리

    // 카드 세부 정보 가져오기
    async function fetchCardDetails() {
        try {
            const response = await fetch(`http://localhost:8080/find/card/${cardId}`);
            const data = await response.json();
            setCardDetails(data["1"][0]);
        } catch (error) {
            console.error('Failed to fetch card details', error);
        }
    }

    useEffect(() => {
        fetchCardDetails();
    }, [cardId]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:8080/favorites', {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Favorites:', data); // 데이터 구조 확인을 위한 로그 추가
    
                    // 데이터가 객체일 경우 구조 확인 후 처리
                    const favorites = Object.values(data["1"] || []);
                    setIsFavorite(favorites.some(fav => fav.id === cardDetails.id));
                } else {
                    console.error('Failed to fetch favorites', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch favorites', error);
            }
        };
    
        if (cardDetails) {
            fetchFavorites();
        }
    }, [cardDetails]);

    const handleFavoriteToggle = async () => {
        // 로그인 세션 확인
        const sessionData = await checkSession();
        
        if (!sessionData.loggedIn) {
            alert("로그인 후 찜하기가 가능합니다."); // 로그인 필요 경고 메시지
            return;
        }
    
        if (!cardDetails || !cardDetails.id) {
            console.error('Card details or ID is missing');
            return;
        }
        
        const apiUrl = isFavorite
            ? `http://localhost:8080/favorites/remove?cardId=${cardDetails.id}`
            : `http://localhost:8080/favorites/add?cardId=${cardDetails.id}`;
        const method = isFavorite ? 'DELETE' : 'POST';
        
        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        
            if (response.ok) {
                setIsFavorite(!isFavorite);
                // 상태를 최신으로 유지하기 위한 추가 fetch
                const updatedFavoritesResponse = await fetch('http://localhost:8080/favorites', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (updatedFavoritesResponse.ok) {
                    const favorites = await updatedFavoritesResponse.json();
                    const favoritesArray = Object.values(favorites["1"] || []);
                    setIsFavorite(favoritesArray.some(fav => fav.id === cardDetails.id));
                }
            } else {
                console.error('Failed to toggle favorite', response.statusText);
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };
    
    useEffect(() => {
        if (cardDetails && cardDetails.locx && cardDetails.locy) {
            const initializeMap = () => {
                const { kakao } = window;

                if (kakao && kakao.maps) {
                    try {
                        const mapContainer = document.getElementById('map');
                        const mapOption = {
                            center: new kakao.maps.LatLng(cardDetails.locy, cardDetails.locx),
                            level: 3
                        };

                        const map = new kakao.maps.Map(mapContainer, mapOption);

                        const markerPosition = new kakao.maps.LatLng(cardDetails.locy, cardDetails.locx);
                        const marker = new kakao.maps.Marker({
                            position: markerPosition,
                            map: map,
                        });

                        // 마커 클릭 이벤트 추가
                        kakao.maps.event.addListener(marker, 'click', function () {
                            const directionsUrl = `https://map.kakao.com/link/to/${encodeURIComponent(cardDetails.name)},${cardDetails.locy},${cardDetails.locx}`;
                            window.open(directionsUrl, '_blank');
                        });

                        // 마커 좌표 확인 로그
                        console.log("Marker Position:", markerPosition);
                        console.log("Map:", map);

                    } catch (error) {
                        console.error("Error initializing Kakao Map: ", error);
                    }
                } else {
                    console.error("Kakao Maps API is not available.");
                }
            };

            initializeMap();
        }
    }, [cardDetails]);

    if (!cardDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed left-0 top-0 w-1/6 h-full z-10">
                <Left />
            </div>
            <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0" style={{ marginLeft: "350px" }}>
                <div style={{ padding: '20px', fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                    <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '25px', marginBottom: '20px' }}>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-700">{cardDetails.name}</h1>
                            <button
                                onClick={handleFavoriteToggle}
                                className={`mr-10  mt-6 py-2 px-5 rounded-lg text-white ${isFavorite ? 'bg-red-400' : 'bg-gray-400'} text-sm`}
                            >
                                {isFavorite ? <FaHeart className="inline mr-1" /> : <FaRegHeart className="inline mr-1" />}
                                {isFavorite ? '찜 해제' : '찜하기'}
                            </button>
                        </div>
                        <p className="text-lg text-gray-600 flex items-center">
                            <PiPhoneCallBold className="mr-2 text-blue-500" />
                            {cardDetails.phone}
                        </p>
                    </div>
                    <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '30px', paddingBottom: '30px' }}>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">전문의 진료과목</h2>
                        {cardDetails.specialistInfo.split(' ').map((info, index) => (
                            <span key={index} className="bg-blue-100 text-blue-600 rounded-full px-4 py-2 text-sm font-medium m-1">
                                {info}
                            </span>
                        ))}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">병원 위치 및 주소</h2>
                        <p className="text-base text-gray-600 mb-4">{cardDetails.address}</p>
                        <div id="map" style={{ width: '100%', height: '400px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
