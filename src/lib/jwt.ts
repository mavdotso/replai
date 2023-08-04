import * as jose from 'jose';

export async function signJwtAccessToken(payload: Record<string, any>) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const alg = 'HS256';
    const jwt = await new jose.SignJWT(payload).setProtectedHeader({ alg }).setIssuedAt().setExpirationTime('7d').sign(secret);

    return jwt;
}

export async function verifyJwt(token: string) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const { payload, protectedHeader } = await jose.jwtVerify(token, secret);
        console.log('Payload: ', payload);
        return payload;
    } catch (error) {
        console.log(error);
        return null;
    }
}
