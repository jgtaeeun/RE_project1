import List from './List.js'
import Left from '../Compo/Left.js'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import image1 from '../Img/medicine.png';
import image2 from '../Img/wound.png';
import image3 from '../Img/knee.png';
import image4 from '../Img/hand.png';
import image5 from '../Img/mental.png';
import image6 from '../Img/osteopathy.png';
import image7 from '../Img/han.png';
import image8 from '../Img/kit.png';
import image9 from '../Img/skin.png';
import image10 from '../Img/ear.png';
import Footer from '../Compo/Footer.js';

export default function Find() {
    const [selectedSpecialist, setSelectedSpecialist] = useState([]);
    const [selectedOther, setSelectedOther] = useState([]);
    const [region1, setRegion1] = useState('');
    const [region2, setRegion2] = useState('');
    const [regions, setRegions] = useState([]);
    const [subregions, setSubregions] = useState([]);
    const navigate = useNavigate();

    const images = [
        image1, image2, image3, image4, image5,
        image6, image7, image8, image9, image10
    ];

    const specialists = ['내과', '외과', '정형외과', '신경과', '정신건강의학과', '재활의학과', '한방내과', '가정의학과', '피부과', '이비인후과'];
    const otherOptions = ['물리치료사', '작업치료사', '사회복지사', '약사'];

    const handleSpecialistChange = (value) => {
        setSelectedSpecialist(prev =>
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const handleOtherChange = (value) => {
        setSelectedOther(prev =>
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const handleSearch = () => {
        if (region1 && region2) {
            const queryParams = new URLSearchParams({
                sido: region1,
                sigungu: region2,
                doctor: selectedSpecialist.join(','),
                person: selectedOther.join(',')
            }).toString();

            navigate(`/find/list?${queryParams}`);
        } else {
            alert('지역은 필수로 선택해야 합니다.');
        }
    };

    const handleReset = () => {
        setSelectedSpecialist([]);
        setSelectedOther([]);
        setRegion1('');
        setRegion2('');
    };

    useEffect(() => {
        fetch('http://localhost:8080/find/regions')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched regions:', data); // 데이터 구조 확인
                setRegions(data); // API에서 받은 데이터 사용
            })
            .catch(error => console.error('Error fetching regions:', error));
    }, []);

    useEffect(() => {
        if (region1) {
            fetch(`http://localhost:8080/find/subregions?region1=${region1}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched subregions:', data); // 데이터 구조 확인
                    const subregionList = data[region1] || [];
                    setSubregions(subregionList); // 수정된 하위 지역 상태 설정
                })
                .catch(error => console.error('Error fetching subregions:', error));
        } else {
            setSubregions([]); // region1이 비어있을 경우 하위 지역 상태를 비움
        }

        setRegion2(''); // 선택된 하위 지역 초기화
    }, [region1]); // region1이 변경될 때마다 이 효과 실행

    return (
        <div className="flex flex-col min-h-screen">
            <div className="fixed left-0 top-0 w-1/6 h-5/6 z-10">
                <Left />
            </div>

            {/* 메인부분 */}
            <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0" style={{ marginLeft: "350px" }}>
                <div className="font-bold mt-6" style={{ fontSize: '2rem' }}>
                    내 맘에 쏙 병원찾기
                </div>
                <div className='mt-6  '>
                    <h1 style={{ fontSize: '0.9rem' }}>- 검색 조건을 선택하세요.</h1>
                    <h1 style={{ fontSize: '0.9rem' }}>- 각 섹션에서 조건을 선택하면 해당 조건에 맞는 병원 목록이 나타납니다.</h1>
                </div>
                <div className="border-b border-gray-300 mt-5"></div>
                <div>
                    {/* 지역 섹션 */}
                    <div className="mb-6">
                        <h2 className="text-1.5rem font-semibold mb-2 mt-10">
                            지역 <span className="text-red-500 text-xl font-bold"> *</span>
                        </h2>
                        <div className="flex space-x-4">
                            <select
                                value={region1}
                                onChange={(e) => setRegion1(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                                style={{ fontSize: '0.8rem' }}
                            >
                                <option value="">시/도 선택</option>
                                {regions.map(region => (
                                    <option key={region.code} value={region.code}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={region2}
                                onChange={(e) => setRegion2(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                                style={{ fontSize: '0.8rem' }}
                            >
                                <option value="">시/군/구 선택</option>
                                {subregions && subregions.map(subregion => (
                                    <option key={subregion.code} value={subregion.code}>
                                        {subregion.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 전문의 섹션 */}
                    <div className="mb-10" style={{ zIndex: 0 }}>
                        <h2 className="text-1.5rem font-semibold mb-2">전문의</h2>
                        <div className="flex justify-center">
                            <div className="grid grid-cols-5 gap-6 mb-5 max-w-screen-xl px-4">
                                {specialists.map((item, index) => (
                                    <button
                                        key={item}
                                        onClick={() => handleSpecialistChange(item)}
                                        className={`w-full aspect-square border rounded-lg flex flex-col items-center justify-center ${selectedSpecialist.includes(item) ? 'bg-blue-100 text-white font-bold' : 'bg-white text-blue-500'} transition-transform transform hover:scale-105`}
                                        style={{
                                            width: "135px",
                                            minHeight: "135px",
                                            padding: "2px",
                                            zIndex: 1,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <img
                                            src={images[index % images.length]}
                                            alt={item}
                                            className="w-16 h-16 object-contain mb-4"
                                        />
                                        <span className="text-black">{item}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 mt-2 ">선택된 전문의: {selectedSpecialist.join(', ')}</p>
                    </div>

                    {/* 기타인력 섹션 */}
                    <div className="mb-10" style={{ zIndex: 0 }}>
                        <h2 className="text-1.5rem font-semibold mb-2">기타인력</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                            {otherOptions.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleOtherChange(item)}
                                    className={`flex items-center justify-center border rounded-lg ${selectedOther.includes(item) ? 'bg-blue-100 text-black font-bold' : 'bg-white text-black-500'} transition-transform transform hover:scale-105`}
                                    style={{
                                        width: '150px',
                                        height: '50px',
                                        zIndex: 1,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-700" >선택된 기타인력: {selectedOther.join(', ')}</p>
                    </div>

                    {/* 검색과 초기화 버튼 */}
                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center border-2 border-blue-500 text-blue-500 font-bold px-5 py-2 
                            rounded-lg transition duration-200 hover:bg-blue-500 hover:text-white"
                            style={{
                                borderRadius: '6px',
                                borderStyle: 'bold',
                                fontSize: '1.0rem',
                                width: '120px',
                                height: '50px'
                            }}
                        >
                            <span>초기화</span>
                            <svg
                                className="ml-2 w-5 h-5 text-bg-blue-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M4 4h5M4 4l5 5M20 20v-5h-.582M20 20h-5M20 20l-5-5"></path>
                            </svg>
                        </button>
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center border-2 border-blue-500 bg-blue-500 text-white font-bold px-5 py-2 rounded-lg  
                            transition duration-200 hover:bg-white  hover:text-blue-500"
                            style={{
                                borderRadius: '6px',
                                borderStyle: 'bold',
                                fontSize: '1.0rem',
                                width: '160px',
                                height: '50px'
                            }}
                        >
                            검색
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}