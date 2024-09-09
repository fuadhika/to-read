declare global {
  namespace Express {
    export interface Request {
      user?: {
        id?: string;
        fullName: string;
        email: string;
        roleId: number;
        roleName: string;
      } | null;
    }
  }
}

export {};
