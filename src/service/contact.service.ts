import { asc, eq, or } from "drizzle-orm";
import { db } from "../db"
import { contacts } from "../db/schema";

/**
 * Finds all contacts directly or indirectly associated with the given email or phoneNumber.
 * This includes:
 * 1. Matches on exact email/phoneNumber
 * 2. All linked secondary records
 * 3. All records pointing to a shared primary
 */
export const findMatchingContacts = async (email?: string, phoneNumber?: string) => {
    // Step 1: Find base records that match either the email or phoneNumber
    const baseContacts = await db.
        select()
        .from(contacts)
        .where(
            or(
                email ? eq(contacts.email, email) : undefined,
                phoneNumber ? eq(contacts.phoneNumber, phoneNumber) : undefined
            )
        )
        .orderBy(asc(contacts.createdAt));

    if (baseContacts.length === 0) return [];

    // Step 2: Extract all unique ids and linkedIds (to find full graph of relationships)
    const idsToSearch = new Set<number>();
    for (const contact of baseContacts) {
        idsToSearch.add(contact.id);
        if (contact.linkedId) idsToSearch.add(contact.linkedId);
    }

    // Step 3: Pull all records that have id or linkedId matching any from the set
    // This brings in the entire web of linked contacts
    const allContacts = await db
        .select()
        .from(contacts)
        .where(
            or(
                ...Array.from(idsToSearch).map((id) =>
                    or(eq(contacts.id, id), eq(contacts.linkedId, id))
                )
            )
        )
        .orderBy(asc(contacts.createdAt));

    return allContacts;
}


/**
 * Inserts a new contact record.
 * Used for both primary and secondary creation.
 */
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


/**
 * Updates a contact — typically used when converting a  primary
 * into a secondary and linking it to the correct primary
 */
export const updateContact = async (id: number, values: {
    linkPrecedence?: 'primary' | 'secondary',
    linkedId?: number,
    phoneNumber?: string,
    email?: string,
}) => {

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