import * as bcrypt from 'bcrypt';

export class CryptoUtil {
    constructor() {}

    static generateHash(value: string): Promise<string> {
        const SALT_CNT = 10;

        return bcrypt.hash(value, SALT_CNT);
    }

    static compareHash(value: string, target: string): Promise<boolean> {
        return bcrypt.compare(value, target);
    }
}
