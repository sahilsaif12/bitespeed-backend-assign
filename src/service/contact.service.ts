import { asc, eq, or } from "drizzle-orm";
import { db } from "../db"
import { contacts } from "../db/schema";


export const findMatchingContacts = async (email?: string, phoneNumber?: string) => {

    return await db.
        select()
        .from(contacts)
        .where(
            or(
                email ? eq(contacts.email, email) : undefined,
                phoneNumber ? eq(contacts.phoneNumber, phoneNumber) : undefined
            )
        )
        .orderBy(asc(contacts.createdAt))
        ;
}

export const insertContact = async (contact: {
    phoneNumber?: string,
    email?: string,
    linkedId?: number,
    linkPrecedence: 'primary' | 'secondary'
}) => {

    const now = new Date();

    const [newContact] = await db
        .insert(contacts)
        .values({
            ...contact,
            createdAt: now,
            updatedAt: now
        })
        .returning()

    return newContact;

}

export const updateContact = async (id: number, values: Partial<typeof contacts._.columns>) => {

    const now = new Date();

    const [updatedContact] = await db
        .update(contacts)
        .set({
            ...values,
            updatedAt: now
        })
        .where(eq(contacts.id, id))
        .returning();

    return updatedContact;
}