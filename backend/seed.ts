import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin seeded:', admin.email);

  // 2. Seed default template exams and questions if they don't exist
  const templateCount = await prisma.exam.count({
    where: {
      title: {
        startsWith: 'Template Ujian'
      }
    }
  });

  if (templateCount === 0) {
    console.log('Seeding default template exams and questions...');

    // Template 1: Matematika Dasar
    const mathExam = await prisma.exam.create({
      data: {
        title: 'Template Ujian Matematika Dasar',
        description: 'Template soal ujian matematika tingkat dasar meliputi aritmatika, aljabar sederhana, dan geometri.',
        durationMinutes: 60,
      }
    });

    await prisma.question.createMany({
      data: [
        {
          examId: mathExam.id,
          text: '<p>Berapakah hasil dari operasi aritmatika berikut?</p><p><strong>12 + 8 &times; 3 - 6</strong></p>',
          options: JSON.stringify([
            '<p>30</p>',
            '<p>54</p>',
            '<p>38</p>',
            '<p>42</p>',
            '<p>26</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: mathExam.id,
          text: '<p>Jika <strong>2x + 5 = 15</strong>, berapakah nilai dari <strong>x</strong>?</p>',
          options: JSON.stringify([
            '<p>5</p>',
            '<p>10</p>',
            '<p>2.5</p>',
            '<p>7.5</p>',
            '<p>4</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: mathExam.id,
          text: '<p>Sebuah segitiga siku-siku memiliki panjang alas <strong>6 cm</strong> dan tinggi <strong>8 cm</strong>. Berapakah panjang sisi miringnya?</p>',
          options: JSON.stringify([
            '<p>10 cm</p>',
            '<p>14 cm</p>',
            '<p>12 cm</p>',
            '<p>9 cm</p>',
            '<p>11 cm</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: mathExam.id,
          text: '<p>Berapakah luas lingkaran dengan jari-jari <strong>7 cm</strong>? (Gunakan <em>&pi; &approx; 22/7</em>)</p>',
          options: JSON.stringify([
            '<p>154 cm²</p>',
            '<p>44 cm²</p>',
            '<p>144 cm²</p>',
            '<p>308 cm²</p>',
            '<p>150 cm²</p>'
          ]),
          correctOption: 'A'
        }
      ]
    });

    // Template 2: Bahasa Indonesia
    const indoExam = await prisma.exam.create({
      data: {
        title: 'Template Ujian Bahasa Indonesia',
        description: 'Template soal ujian bahasa Indonesia tentang ejaan yang disempurnakan (EYD), pemahaman teks, dan tata bahasa.',
        durationMinutes: 45,
      }
    });

    await prisma.question.createMany({
      data: [
        {
          examId: indoExam.id,
          text: '<p>Manakah penulisan kata baku yang tepat menurut PUEBI di bawah ini?</p>',
          options: JSON.stringify([
            '<p>Apotek, Analisis, Kualitas</p>',
            '<p>Apotik, Analisa, Kwalitas</p>',
            '<p>Apotek, Analisa, Kualitas</p>',
            '<p>Apotik, Analisis, Kwalitas</p>',
            '<p>Apotek, Analisis, Kwalitas</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: indoExam.id,
          text: '<p>Bacalah paragraf berikut dengan saksama:</p><blockquote><em>"Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan Anda dapat mengubah dunia." - Nelson Mandela</em></blockquote><p>Kata <strong>"senjata"</strong> dalam kutipan di atas bermakna...</p>',
          options: JSON.stringify([
            '<p>Alat perjuangan atau kekuatan untuk melakukan perubahan</p>',
            '<p>Alat perang atau amunisi fisik</p>',
            '<p>Sesuatu yang membahayakan jiwa</p>',
            '<p>Benda tajam untuk pertahanan diri</p>',
            '<p>Strategi militer</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: indoExam.id,
          text: '<p>Kalimat berikut yang merupakan kalimat efektif adalah...</p>',
          options: JSON.stringify([
            '<p>Bagi para siswa diharapkan berkumpul di lapangan sekolah.</p>',
            '<p>Siswa diharapkan berkumpul di lapangan sekolah.</p>',
            '<p>Para siswa-siswa sekalian diharapkan berkumpul di lapangan.</p>',
            '<p>Untuk siswa-siswa semua diharapkan berkumpul di lapangan.</p>',
            '<p>Kepada para siswa sekalian diharapkan berkumpul di lapangan.</p>'
          ]),
          correctOption: 'B'
        }
      ]
    });

    // Template 3: Sains dan Teknologi
    const scienceExam = await prisma.exam.create({
      data: {
        title: 'Template Ujian Sains & Teknologi',
        description: 'Template soal sains meliputi biologi, fisika, kimia, dan teknologi dasar.',
        durationMinutes: 60,
      }
    });

    await prisma.question.createMany({
      data: [
        {
          examId: scienceExam.id,
          text: '<p>Planet manakah di tata surya kita yang dijuluki sebagai <strong>"Planet Merah"</strong>?</p>',
          options: JSON.stringify([
            '<p>Mars</p>',
            '<p>Venus</p>',
            '<p>Merkurius</p>',
            '<p>Saturnus</p>',
            '<p>Yupiter</p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: scienceExam.id,
          text: '<p>Manakah dari senyawa kimia berikut yang merupakan rumus molekul untuk <strong>air</strong>?</p>',
          options: JSON.stringify([
            '<p>H<sub>2</sub>O</p>',
            '<p>CO<sub>2</sub></p>',
            '<p>NaCl</p>',
            '<p>O<sub>2</sub></p>',
            '<p>C<sub>6</sub>H<sub>12</sub>O<sub>6</sub></p>'
          ]),
          correctOption: 'A'
        },
        {
          examId: scienceExam.id,
          text: '<p>Siapakah ilmuwan yang mengemukakan teori relativitas khusus dan umum?</p>',
          options: JSON.stringify([
            '<p>Albert Einstein</p>',
            '<p>Isaac Newton</p>',
            '<p>Nikola Tesla</p>',
            '<p>Galileo Galilei</p>',
            '<p>Marie Curie</p>'
          ]),
          correctOption: 'A'
        }
      ]
    });

    console.log('Templates seeded successfully.');
  } else {
    console.log('Templates already exist. Skipping template seeding.');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
