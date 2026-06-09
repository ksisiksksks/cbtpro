import bcrypt from 'bcryptjs';
async function run() {
  const isMatch = await bcrypt.compare('admin123', '.BaMI2');
  console.log('Match?', isMatch);
}
run();
