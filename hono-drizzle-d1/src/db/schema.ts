import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  // id is set on insert, incrementing
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

  // title of the blog post
  title: text('title', { length: 256 }).notNull(),

  // content of the blog post
  content: text('content', { length: 256 }).notNull(),

  // author of the blog post
  author: text('author', { length: 256 }).default('anonymous'),

  // timestamp is set on insert
  timestamp: text('timestamp')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});