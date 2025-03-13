export interface Live {
  _id?: string;
  title: string;
  playbackUrl: string;
  streamKey: string;
  isLive: boolean;
  startDate: Date;
  upcomming: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LiveState {
  upComingLives: Live[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: LiveState = {
  upComingLives: [],
  isLoading: false,
  error: null,
};
