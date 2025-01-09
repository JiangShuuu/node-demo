import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";
import CreateController from "./create";
import UpdateController from "./update";

const users = new Hono()

const getUsers = async (c: Context) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          id: {
            not: {
              gt: 2
            }
          }
        },
        {
          name: {
            startsWith: 's'
          }
        }
      ]
      // name: 'John'
      // name: {
      //   // startsWith: 'J'
      //   // endsWith: 'n'
      //   // contains: 'a'
      // }
      // id: {
      //   // in: [1, 2]
      //   // notIn: [1, 2]
      //   not: {
      //     // in: [1, 2]
      //     // gt: 2 // greater than 
      //   }
      // }
    }
  })

  return c.json(users) 
}

// every，some，none 適用於 many-to-many or one-to-many 的關係
const getUsersEvery = async (c: Context) => {

  // every: 找出 user 中所有的 posts 都 published 為 true 的 user
  const users = await prisma.user.findMany({
    where: {
      posts: {
        every: {
          published: true 
        }
      }
    }
  })

  return c.json(users)
}

const getUsersSome = async (c: Context) => {
  // some: 找出 user 的 posts 中至少有一個 published 為 true 的 user
  const users = await prisma.user.findMany({
    where: {
      posts: {
        some: {
          published: true
        }
      }
    }
  })

  return c.json(users)
}

const getUsersNone = async (c: Context) => {

  // none: 找出 user 的所有 posts 中的 published 沒有 false 的 user
  // 也就是說，user 的所有 posts 中都已發佈的 user
  const users = await prisma.user.findMany({
    where: {
      posts: {
        none: {
          published: false
        }
      }
    }
  })

  return c.json(users)
}

users.get('/', getUsers)
users.get('/every', getUsersEvery)
users.get('/some', getUsersSome)
users.get('/none', getUsersNone)

users.route('/create', CreateController)
users.route('/update', UpdateController)

export default users
