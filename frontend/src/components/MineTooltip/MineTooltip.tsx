import React from 'react';
import { useMineStore } from '../../store/mineStore';

const MineTooltip: React.FC = () => {
  const { hoveredMine } = useMineStore();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hoveredMine) return null;

  const props = hoveredMine.properties;

  return (
    <div
      className="fixed pointer-events-none z-[1000] bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl px-3 py-2 max-w-xs"
      style={{
        left: `${Math.min(mousePosition.x + 10, window.innerWidth - 320)}px`,
        top: `${Math.min(mousePosition.y - 40, window.innerHeight - 100)}px`,
      }}
    >
      <div className="text-white text-sm space-y-1">
        <div className="font-semibold text-cyan-400">{props.name || 'Unknown Mine'}</div>
        <div className="text-xs text-gray-300">
          <span className="text-gray-400">Country:</span> {props.country || 'Unknown'}
        </div>
        <div className="text-xs text-gray-300">
          <span className="text-gray-400">Commodity:</span> {props.primaryCommodity || 'Unknown'}
        </div>
        <div className="text-xs text-cyan-300 mt-1">Click for details →</div>
      </div>
    </div>
  );
};

export default MineTooltip;