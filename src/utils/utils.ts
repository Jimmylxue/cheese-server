/**
 * 生成随机6位字符
 * @returns string
 */
export function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
}

/**
 * 检查是否是qq邮箱
 * @param mail string
 */
export function isQQMail(mail: string) {
  return /^[1-9]\d{4,10}@qq\.com$/.test(mail);
}
