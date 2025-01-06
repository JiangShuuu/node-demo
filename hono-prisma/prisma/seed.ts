import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Data Base" },
  { name: "Big Data" },
  { name: "AI" },
  { name: "Cloud" }
];

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
        likeNum: Math.floor(Math.random() * 100) + 1
      }))
    }
  },
];

async function main() {
  console.log(`Start seeding ...`);
  
  // 清除現有數據
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 先創建 categories 並保存它們的 id
  const createdCategories = await Promise.all(
    categories.map(category => 
      prisma.category.create({ data: category })
    )
  );

  // 修改 userData 中的 categories connect
  const modifiedUserData = userData.map(user => ({
    ...user,
    posts: {
      create: ((user.posts as any).create as any[]).map(post => ({
        ...post,
        categories: {
          connect: createdCategories
            .sort(() => Math.random() - 0.5)  // 隨機打亂
            .slice(0, Math.floor(Math.random() * 3) + 1)  // 隨機取1-3個
            .map(cat => ({ id: cat.id }))  // 使用 id 連接
        }
      }))
    }
  }));

  // 創建 users 和 posts
  for (const u of modifiedUserData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
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