import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";

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

users.get('/', getUsers)

export default users