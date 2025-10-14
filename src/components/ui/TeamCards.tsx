import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  gradient: string;
  bgColor: string;
  
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ramswaroop Patel',
    role: 'Team Lead',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    
    image: '/devimages/ramswaroop.jpg',
  },
  {
    name: 'Harsh Srivastava',
    role: 'Agentic AI Developer',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    
    image: '/devimages/team/michael.jpg',
  },
  {
    name: 'Aayush Samal',
    role: 'Backend Developer',
    gradient: 'from-orange-500 via-yellow-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
   
    image: '/devimages/aayush.webp',
  },
  {
    name: 'Swathi P',
    role: 'Backend Developer',
    gradient: 'from-green-500 via-emerald-500 to-lime-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    image: '/devimages/team/james.jpg',
  },
  {
    name: 'Keval Solankure',
    role: 'Frontend Developer',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    
    image: '/devimages/keval.jpg',
  },
];

export default function TeamCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Calculate card style based on position relative to current index
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = teamMembers.length;
    
    // Normalize diff to handle wrap-around (-3 to 3 for smooth circular layout)
    let normalizedDiff = diff;
    if (diff > totalCards / 2) {
      normalizedDiff = diff - totalCards;
    } else if (diff < -totalCards / 2) {
      normalizedDiff = diff + totalCards;
    }

    const absDiff = Math.abs(normalizedDiff);
    const isActive = index === currentIndex;

    return {
      transform: `
        translateX(${normalizedDiff * 75}%)
        translateZ(${isActive ? 0 : -absDiff * 150}px)
        scale(${isActive ? 1.15 : 1 - absDiff * 0.2})
        rotateY(${normalizedDiff * 8}deg)
      `,
      opacity: absDiff > 2 ? 0 : 1 - absDiff * 0.25,
      zIndex: 10 - absDiff,
      transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      filter: isActive ? 'brightness(1.1)' : `brightness(${1 - absDiff * 0.15})`,
    };
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header - Mobile First */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent mb-3 sm:mb-4 px-4">
            Meet Our Amazing Team
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Passionate professionals driving innovation and excellence
          </p>
        </div>

        {/* 3D Carousel Container */}
        <div
          ref={containerRef}
          style={{ 
            perspective: '1500px',
            height: 'clamp(400px, 50vw, 550px)'
          }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Cards with 3D Transform */}
          <div className="relative w-full h-full flex items-center justify-center">
            {teamMembers.map((member, index) => {
              const style = getCardStyle(index);
              const isActive = index === currentIndex;
              
              return (
                <div
                  key={index}
                  className="absolute w-64 sm:w-72 md:w-80 lg:w-96 h-80 sm:h-[350px] md:h-96 lg:h-[450px] cursor-pointer"
                  style={{
                    ...style,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => goToSlide(index)}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
                      isActive ? 'ring-2 sm:ring-4 ring-primary/60 ring-offset-2 sm:ring-offset-4 ring-offset-background' : ''
                    }`}
                  >
                    {/* Card Background with Gradient */}
                    <div className={`absolute inset-0 ${member.bgColor}`}>
                      {member.image ? (
                        <>
                          {/* Team Member Image */}
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Gradient Overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </>
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-20`} />
                      )}
                    </div>

                    {/* Content - Mobile First Layout */}
                    <div className="relative h-full p-5 sm:p-6 lg:p-8 flex flex-col items-center justify-end text-center pb-6 sm:pb-8">
                      {/* Icon Badge - Top Right */}
                      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-2xl sm:text-3xl opacity-80 drop-shadow-lg">
                        
                      </div>

                      {member.image ? (
                        <>
                          {/* Name */}
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                            {member.name}
                          </h3>

                          {/* Role */}
                          <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium mb-3 sm:mb-4 drop-shadow-md">
                            {member.role}
                          </p>

                          {/* Decorative Line */}
                          <div
                            className={`w-16 sm:w-20 lg:w-24 h-1 rounded-full bg-gradient-to-r ${member.gradient} opacity-90 hover:opacity-100 transition-all duration-300 hover:w-24 sm:hover:w-28`}
                          />

                          {/* Status Badge */}
                          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-white/80">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span>Active Now</span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Large Avatar Circle - Fallback */}
                          <div className="mb-4 sm:mb-6 relative">
                            <div
                              className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br ${member.gradient} shadow-2xl flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold ring-4 ring-background relative overflow-hidden transform transition-transform duration-300 hover:scale-110`}
                            >
                              {member.name.split(' ').map(n => n[0]).join('')}
                              
                              {/* Animated Pulse */}
                              <div
                                className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 hover:opacity-40 animate-pulse`}
                              />
                            </div>
                            
                            {/* Glow Effect */}
                            <div
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} blur-xl opacity-30`}
                            />
                          </div>

                          {/* Name */}
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3 hover:text-primary transition-colors duration-300 px-2">
                            {member.name}
                          </h3>

                          {/* Role */}
                          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium mb-4 sm:mb-6 px-2">
                            {member.role}
                          </p>

                          {/* Decorative Line */}
                          <div
                            className={`w-16 sm:w-20 lg:w-24 h-1 rounded-full bg-gradient-to-r ${member.gradient} opacity-70 hover:opacity-100 transition-all duration-300 hover:w-24 sm:hover:w-28`}
                          />

                          {/* Status Badge */}
                          <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground/80">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Active Now</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Border Glow */}
                    <div
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-background/95 backdrop-blur-xl border-2 border-primary/40 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-background/95 backdrop-blur-xl border-2 border-primary/40 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
            {teamMembers.map((_, index) => (
                <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 sm:w-12 bg-primary shadow-lg shadow-primary/50'
                    : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 w-24 sm:w-32 lg:w-48 h-full bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-40" />
          <div className="absolute right-0 top-0 w-24 sm:w-32 lg:w-48 h-full bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-40" />
        </div>

        {/* Auto-play indicator */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-xs sm:text-sm text-muted-foreground/60">
            {isAutoPlaying ? '● Auto-playing' : '❚❚ Paused'} • Hover to pause • Click to navigate
          </p>
        </div>
      </div>
    </section>
);
}

