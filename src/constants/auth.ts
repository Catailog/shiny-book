export const PASSWORD_MIN_LENGTH = 8;
// bcrypt 알고리즘 자체가 72바이트까지만 해싱하는 하드 리밋(Supabase Auth도 동일)
export const PASSWORD_MAX_LENGTH = 72;

// RFC 5321 기준 실무상 상한
export const EMAIL_MAX_LENGTH = 254;
