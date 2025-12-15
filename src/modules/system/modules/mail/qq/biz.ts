export const REGISTER_VERIFICATION_CODE_KEY = 'register_verification_code';

export const keyMap = {
  register: REGISTER_VERIFICATION_CODE_KEY,
};

export type KeyType = keyof typeof keyMap;
