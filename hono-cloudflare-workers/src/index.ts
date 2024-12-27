import App from "./app";
import PostController from "./controllers/posts";
import UserController from "./controllers/users";

// import { jwt } from "hono/jwt";

const app = App;

// const guestPage = ["/auth/login", "/auth/register"];

// app.use("*", (c, next) => {
//   const path = c.req.path;
//   if (guestPage.includes(path)) {
//     return next();
//   }
//   const jwtMiddleware = jwt({
//     secret: c.env.JWT_SECRET,
//   });
//   return jwtMiddleware(c, next);
// });

app.route("/", PostController);
app.route("/", UserController);
export default app;