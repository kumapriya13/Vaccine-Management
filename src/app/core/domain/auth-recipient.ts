export interface IAuthRecipient {
    uuid: string;
    email: string;
    phone: string;
    expireAt: string;
    jwt?: string;
}
