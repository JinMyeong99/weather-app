export interface Favorite {
  id: string;
  alias: string;
  district: {
    fullName: string;
    displayName: string;
    sido: string;
    sigungu?: string;
    dong?: string;
  };
  lat: number;
  lon: number;
}
