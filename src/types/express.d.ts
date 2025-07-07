import { IUser } from '../models/user';


interface AdminPayload {
    id: string;
    isAdmin: boolean;
}


declare global {
    namespace Express {
        interface Request {
            user?: IUser | AdminPayload | null;
        }
    }
}
