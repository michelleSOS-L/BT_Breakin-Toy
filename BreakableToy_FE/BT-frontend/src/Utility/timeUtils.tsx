export const formatDuration = (minutes: number): string => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60);
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (minutes < 60) {
      const rounded = Math.round(minutes);
      return `${rounded} minute${rounded !== 1 ? 's' : ''}`;
    } else if (minutes < 1440) {
      const hours = minutes / 60;
      const rounded = Math.round(hours * 10) / 10; // e.g., 1.5h
      return `${rounded} hour${rounded !== 1 ? 's' : ''}`;
    } else {
      const days = minutes / 1440;
      const rounded = Math.round(days * 10) / 10;
      return `${rounded} day${rounded !== 1 ? 's' : ''}`;
    }
  };
  