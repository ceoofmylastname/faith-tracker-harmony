import { useRef, useState, useEffect } from 'react';

interface InteractiveCardProps {
  title: string;
  description: string;
  image: string;
}

export const InteractiveCard = ({ title, description, image }: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      setWidth(cardRef.current.offsetWidth);
      setHeight(cardRef.current.offsetHeight);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left - width / 2);
      setMouseY(e.clientY - rect.top - height / 2);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setMouseX(0);
      setMouseY(0);
    }, 1000);
  };

  const mousePX = mouseX / width;
  const mousePY = mouseY / height;
  const rX = mousePX * 30;
  const rY = mousePY * -30;
  const tX = mousePX * -40;
  const tY = mousePY * -40;

  return (
    <div
      className="card-wrap m-4 transform-gpu cursor-pointer"
      style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div
        className="card relative flex-none w-[240px] h-[320px] bg-gray-800 overflow-hidden rounded-lg transition duration-1000"
        style={{
          transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
          boxShadow: 'rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px, inset rgba(255, 255, 255, 0.5) 0 0 0 6px'
        }}
      >
        <div
          className="card-bg absolute -top-5 -left-5 w-full h-full p-5 bg-no-repeat bg-center bg-cover opacity-50 transition duration-1000 pointer-events-none"
          style={{
            backgroundImage: `url(${image})`,
            transform: `translateX(${tX}px) translateY(${tY}px)`
          }}
        />
        <div
          className="card-info absolute bottom-0 p-5 text-white transform translate-y-[40%] transition-transform duration-600 ease-out"
          style={{ transitionDelay: '1.6s' }}
        >
          <h1 className="font-playfair text-4xl font-bold text-shadow-lg relative z-10">
            {title}
          </h1>
          <p className="opacity-0 text-shadow-md transition-opacity duration-600 delay-[1.6s] relative z-10 mt-2.5">
            {description}
          </p>
          <div
            className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 transform translate-y-full transition-all duration-[5s] delay-[1s]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};