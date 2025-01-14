import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { length: 256 }).notNull(),
  email: text('email', { length: 256 }).unique().notNull(),
  password: text('password', { length: 256 }).notNull(),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const post = sqliteTable('post', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title', { length: 256 }).notNull(),
  content: text('content', { length: 256 }).notNull(),
  rating: integer('rating').notNull(),
  userId: integer('user_id').references(() => user.id),
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post)
}));

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.userId],
    references: [user.id],
  })
}));