import { useRef, useState } from "react";

interface InteractiveCardProps {
  title: string;
  description: string;
  image: string;
}

export const InteractiveCard = ({ title, description, image }: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setMousePosition({ x: 0, y: 0 });
    }, 1000);
  };

  const rX = (mousePosition.x / (cardRef.current?.offsetWidth ?? 1)) * 30;
  const rY = (mousePosition.y / (cardRef.current?.offsetHeight ?? 1)) * -30;
  const tX = (mousePosition.x / (cardRef.current?.offsetWidth ?? 1)) * -40;
  const tY = (mousePosition.y / (cardRef.current?.offsetHeight ?? 1)) * -40;

  return (
    <div
      ref={cardRef}
      className="relative w-60 h-80 cursor-pointer m-2.5 transform-gpu perspective-800"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-1000 ease-return-ease"
        style={{
          transform: `rotateY(${rX}deg) rotateX(${rY}deg)`,
          backgroundColor: "#333",
          boxShadow: `
            rgba(255, 255, 255, 0.2) 0 0 40px 5px,
            rgba(255, 255, 255, 1) 0 0 0 1px,
            rgba(0, 0, 0, 0.66) 0 30px 60px 0,
            inset #333 0 0 0 5px,
            inset white 0 0 0 6px
          `,
        }}
      >
        <div
          className="absolute inset-[-20px] bg-cover bg-center transition-all duration-1000 ease-return-ease opacity-50 pointer-events-none p-5"
          style={{
            backgroundImage: `url(${image})`,
            transform: `translateX(${tX}px) translateY(${tY}px)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-[40%] transition-all duration-600 ease-hover-ease"
          style={{
            zIndex: 1,
          }}
        >
          <h3 className="font-playfair text-3xl font-bold mb-2 text-shadow-lg">
            {title}
          </h3>
          <p className="opacity-0 transition-opacity duration-600 ease-hover-ease text-shadow-md group-hover:opacity-100">
            {description}
          </p>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 transform translate-y-full transition-all duration-[5s] ease-hover-ease"
            style={{ mixBlendMode: "overlay" }}
          />
        </div>
      </div>
    </div>
  );
};