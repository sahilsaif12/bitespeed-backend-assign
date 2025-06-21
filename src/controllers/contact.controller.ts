import { Request, Response } from 'express';
import { findMatchingContacts, insertContact, updateContact } from '../service/contact.service';


export const identifyContact = async (req, res) => {
    const { email, phoneNumber } = req.body;

    // Step 0: Neither email nor phone number is provided → Invalid input
    if (!email && !phoneNumber)
        return res.status(400).json({ message: 'email or phoneNumber is required' });

    //  Step 1: Look for existing contacts with either email or phoneNumber
    const existingContacts = await findMatchingContacts(email, phoneNumber);

    //  Step 2: No existing match → treat as new user → insert as primary
    if (existingContacts.length === 0) {
        const primary = await insertContact({ email, phoneNumber, linkPrecedence: 'primary' });
        return res.json({
            contact: {
                primaryContactId: primary.id,
                emails: [primary.email],
                phoneNumbers: [primary.phoneNumber],
                secondaryContactIds: [],
            },
        });
    }

    // Step 3: One or more matching contacts found
    // Choose the primary contact among them or  "oldest primary" (first created) contact as the canonical root
    const primary = existingContacts.find(c => c.linkPrecedence === 'primary') || existingContacts[0];


    // Step 4: Storing all secondary contacts
    const secondaryContacts: typeof primary[] = [];
    for (const c of existingContacts) {
        // Step 4.1: if the contact previously was primary but now qualifies as secondary, update it to secondary contact
        if (c.id !== primary.id && (c.linkPrecedence !== 'secondary' || c.linkedId !== primary.id)) {
            await updateContact(c.id, {
                linkPrecedence: 'secondary',
                linkedId: primary.id,
            });
            // storing the updated contact (primary->secondary) in secondaryContacts
            secondaryContacts.push({ ...c, linkPrecedence: 'secondary', linkedId: primary.id });
        }
        // 4.2 : storing other normal secondary contacts
        else if (c.id !== primary.id) {
            secondaryContacts.push(c);
        }
    }

    const emailExists = existingContacts.some(c => c.email === email);
    const phoneExists = existingContacts.some(c => c.phoneNumber && Number(c.phoneNumber) === phoneNumber);

    let newSecondary;
    // Step 5: if email is provided and that email does not exist in the any existing contacts, create a seconary contact and link it to primary
    // same for phone number
    if ((email && !emailExists) || (phoneNumber && !phoneExists)) {
        newSecondary = await insertContact({
            email,
            phoneNumber,
            linkPrecedence: 'secondary',
            linkedId: primary.id,
        });
    }

    // Step 6: Collect all contacts
    // Combine primary, all secondary contacts, and the new secondary contact (if created)
    const allContacts = [...new Set([primary, ...secondaryContacts, newSecondary].filter(Boolean))];

    return res.json({
        contact: {
            primaryContactId: primary.id,
            emails: [...new Set(allContacts.map(c => c.email).filter(Boolean))],
            phoneNumbers: [...new Set(allContacts.map(c => c.phoneNumber).filter(Boolean))],
            secondaryContactIds: allContacts
                .filter(c => c.linkPrecedence === 'secondary')
                .map(c => c.id),
        },
    });
}