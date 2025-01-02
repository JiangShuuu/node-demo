import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const generatePostTitle = (index: number) => {
  const topics = ['Prisma', 'GraphQL', 'TypeScript', 'Node.js', 'Database'];
  const actions = ['Introduction to', 'Deep Dive into', 'Tutorial about', 'Guide for', 'Best Practices of'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  return `${actions[Math.floor(Math.random() * actions.length)]} ${topic} #${index}`;
};

const userData: Prisma.UserCreateInput[] = [
  {
    name: "John",
    email: "John@prisma.io",
    posts: {
      create: Array.from({ length: 55 }, (_, index) => ({
        title: generatePostTitle(index + 1),
        published: Math.random() > 0.3, // 70% 機率發布
        categories: {
          create: [
            { name: "Data Base" },
            { name: "Big Data" }
          ]
        },
        likeNum: Math.floor(Math.random() * 100) + 1
      }))
    },
  },
  {
    name: "Jack",
    email: "jack@prisma.io",
    posts: {
      create: Array.from({ length: 45 }, (_, index) => ({
        title: generatePostTitle(index + 1),
        published: Math.random() > 0.3, // 70% 機率發布
        categories: {
          create: [
            { name: "Data Base" }
          ]
        },
        likeNum: Math.floor(Math.random() * 100) + 1
      }))
    }
  },
  {
    name: "sara",
    email: "sara@prisma.io",
    posts: {
      create: Array.from({ length: 35 }, (_, index) => ({
        title: generatePostTitle(index + 1),
        published: Math.random() > 0.3, // 70% 機率發布
        categories: {
          create: [ 
            { name: "AI" },
            { name: "Cloud" },
          ]
        },
        likeNum: Math.floor(Math.random() * 100) + 1
      }))
    }
  },
];

async function main() {
  console.log(`Start seeding ...`);
  
  // 清除現有數據（注意順序：先刪除有外鍵關係的表）
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 再創建 users 和 posts
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });