export default function generateRandomNumberString(length: number): string {
  const maxNumber = Math.pow(10, length) - 1;
  const randomNumber = Math.floor(Math.random() * maxNumber);
  return randomNumber.toString().padStart(length, '0');
}
