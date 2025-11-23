export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('vi-VN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getLocationString = (coordinates: number[]): string => {
  return `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
};
