import {hover} from "@testing-library/user-event/dist/hover"

export default function ButtonC({title, text, bcolor, handleClick}){
     const colorB={
          'sky' : 'bg-sky-600',
          'blue' : 'bg-blue-600',
          'purple' : 'bg-violet-400',
          'teal' : 'bg-teal-500',
     }

     const colorBhover = {
          'sky': 'hover:bg-sky-800',
          'blue': 'hover:bg-blue-800',
          'purple': 'hover:bg-violet-500',
          'teal': 'hover:bg-teal-700',
        };
     
     return (
    <button
      className={`flex justify-start items-center py-10 px-10 m-5 text-white font-bold border border-gray-200 rounded shadow
               ${colorB[bcolor]} ${colorBhover[bcolor]}`}
      onClick={handleClick}
      style={{ width: '250px', height: '180px' }} 
    >
      <div className="flex flex-col items-start text-left h-full justify-center"> {/* 상하 여백을 추가 */}
        <span className="text-xl mb-8" style={{ fontSize: '1.1rem' }}>{title}</span> {/* 위 텍스트에 하단 마진 추가 */}
        <span className="text-s font-thin" style={{ fontSize: '0.9rem' }}>{text}</span> {/* 아래 텍스트 */}
      </div>
    </button>
  );
}