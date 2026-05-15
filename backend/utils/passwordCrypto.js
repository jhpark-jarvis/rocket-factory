import bcrypt from 'bcrypt';

/**
 * 비밀번호 암호화 및 검증 유틸리티 모듈
 * bcrypt를 사용하여 안전하게 비밀번호를 처리합니다.
 */

// Salt rounds: 높을수록 보안은 좋지만 시간이 오래 걸림 (기본값: 10-12)
const SALT_ROUNDS = 10;

/**
 * 평문 비밀번호를 해시하여 반환합니다.
 * @param {string} plainPassword - 암호화할 평문 비밀번호
 * @returns {Promise<string>} 해시된 비밀번호
 * @throws {Error} 비밀번호가 유효하지 않은 경우
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  if (plainPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
}

/**
 * 평문 비밀번호와 해시된 비밀번호를 비교합니다.
 * @param {string} plainPassword - 비교할 평문 비밀번호
 * @param {string} hashedPassword - 데이터베이스에 저장된 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 * @throws {Error} 비밀번호 검증 중 오류 발생
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Plain password must be a non-empty string');
  }

  if (!hashedPassword || typeof hashedPassword !== 'string') {
    throw new Error('Hashed password must be a non-empty string');
  }

  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Password verification failed: ${error.message}`);
  }
}

/**
 * 비밀번호가 유효한지 검사합니다.
 * @param {string} password - 검증할 비밀번호
 * @returns {Object} 검증 결과 { isValid: boolean, error: string|null }
 */
export function validatePassword(password) {
  const result = {
    isValid: true,
    errors: []
  };

  if (!password || typeof password !== 'string') {
    result.isValid = false;
    result.errors.push('Password must be a string');
    return result;
  }

  if (password.length < 6) {
    result.isValid = false;
    result.errors.push('Password must be at least 6 characters');
  }

  if (password.length > 128) {
    result.isValid = false;
    result.errors.push('Password must not exceed 128 characters');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one digit');
  }

  if (result.errors.length > 0) {
    result.isValid = false;
  }

  return result;
}

export default {
  hashPassword,
  verifyPassword,
  validatePassword,
  SALT_ROUNDS
};
