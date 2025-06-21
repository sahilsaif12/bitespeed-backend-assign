import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const linkPrecedenceEnum = pgEnum('link_precedence', ['primary', 'secondary']);

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number'),
  email: text('email'),
  linkedId: integer('linked_id'), // FK to contacts.id (self)
  linkPrecedence: linkPrecedenceEnum('link_precedence').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
