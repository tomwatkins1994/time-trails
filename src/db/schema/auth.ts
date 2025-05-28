import { relations } from "drizzle-orm";
import {
	boolean,
	timestamp,
	pgTable,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
	"user",
	{
		id: uuid().primaryKey().defaultRandom(),
		name: varchar().notNull(),
		email: varchar().notNull(),
		emailVerified: boolean(),
		image: varchar(),
		createdAt: timestamp().defaultNow(),
		updatedAt: timestamp(),
	},
	(t) => [unique().on(t.email)],
);

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const session = pgTable("session", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => user.id),
	token: varchar().notNull(),
	expiresAt: timestamp(),
	ipAddress: varchar(),
	userAgent: varchar(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp(),
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const account = pgTable("account", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => user.id),
	accountId: varchar().notNull(),
	providerId: varchar(),
	accessToken: varchar(),
	refreshToken: varchar(),
	accessTokenExpiresAte: timestamp(),
	refreshTokenExpiresAt: timestamp(),
	scope: varchar(),
	idToken: varchar(),
	password: varchar(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp(),
});

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const verification = pgTable("verification", {
	id: uuid().primaryKey().defaultRandom(),
	identifier: varchar().notNull(),
	value: varchar().notNull(),
	expiresAt: timestamp(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp(),
});
