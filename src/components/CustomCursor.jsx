import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth ring follower effect
  useEffect(() => {
    let animationFrameId;
    
    const updateRing = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Ease speed
        const ease = 0.15;
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease
        };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    updateRing();
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  useEffect(() => {
    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, select, textarea, .interactive-card'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Clean up or re-bind (might need dynamic check, but fine for static nodes)
    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [isHidden]); // Re-attach when nodes render/change visibility

  if (isHidden) return null;

  return (
    <>
      {/* Small center dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-accentCyan rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Outer ring */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border ${
          isHovered 
            ? 'w-12 h-12 bg-primary/10 border-primary shadow-glow-primary scale-110' 
            : 'w-8 h-8 border-accentPink/80 shadow-glow-pink'
        }`}
        style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }}
      />
    </>
  );
};

export default CustomCursor;
