import { useEffect } from 'react';
import { useMineStore } from '../store/mineStore';

export const useKeyboardShortcuts = () => {
  const {
    selectedMine,
    setSelectedMine,
    showFilters,
    setShowFilters,
    showStats,
    setShowStats,
    resetFilters,
    filters
  } = useMineStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          // Close panels in order of priority
          if (selectedMine) {
            setSelectedMine(null);
          } else if (showFilters) {
            setShowFilters(false);
          } else if (showStats) {
            setShowStats(false);
          }
          break;

        case 'f':
        case 'F':
          // Toggle filters panel
          if (!event.ctrlKey && !event.metaKey) {
            setShowFilters(!showFilters);
          }
          break;

        case 's':
        case 'S':
          // Toggle stats panel
          if (!event.ctrlKey && !event.metaKey) {
            setShowStats(!showStats);
          }
          break;

        case 'r':
        case 'R':
          // Reset filters
          if (!event.ctrlKey && !event.metaKey) {
            const hasActiveFilters = 
              filters.searchQuery ||
              filters.selectedCommodities.length > 0 ||
              filters.selectedCountries.length > 0 ||
              filters.selectedAssetTypes.length > 0;
            
            if (hasActiveFilters) {
              resetFilters();
            }
          }
          break;

        case '?':
          // Show keyboard shortcuts help
          if (event.shiftKey) {
            showKeyboardShortcutsHelp();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    selectedMine,
    setSelectedMine,
    showFilters,
    setShowFilters,
    showStats,
    setShowStats,
    resetFilters,
    filters
  ]);
};

const showKeyboardShortcutsHelp = () => {
  const shortcuts = `
Keyboard Shortcuts:
━━━━━━━━━━━━━━━━━
ESC - Close active panel
F - Toggle filters
S - Toggle statistics
R - Reset all filters
? - Show this help
  `;
  console.log(shortcuts);
  // In production, you'd show this in a modal
};

export default useKeyboardShortcuts;