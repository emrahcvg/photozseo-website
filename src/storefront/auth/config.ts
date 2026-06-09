/** Google Web OAuth Client ID — public (client JS + server aud doğrulaması). */
export const GOOGLE_CLIENT_ID = '835236547289-r4ci9qrk2t38g2naao13hv29tcjs416l.apps.googleusercontent.com';
/** iOS native GoogleSignIn OAuth Client ID — iOS idToken'ın aud'u bu olur (aynı Google projesi). */
export const GOOGLE_CLIENT_ID_IOS = '835236547289-2efkkljdrvpr9d6jgu0ccjcisf2p7ovg.apps.googleusercontent.com';
/** Geçerli aud değerleri: web storefront + iOS native uygulama. */
export const GOOGLE_ALLOWED_AUDS = [GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_IOS];
export const SESSION_COOKIE = 'pz_session';
export const SESSION_TTL_DAYS = 30;
