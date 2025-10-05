declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      // timestamp string akshually
      createdAt: string;
      displayName: string;
      fullName: string;
      firebaseUserId: string;
    };
  }
}
