'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { generateUUID } from './utils';
import { UUID } from "crypto";


const FormSchema = z.object({
  title: z.string({
    invalid_type_error: "Please enter a battle name"
  }),
  description: z.string({
    invalid_type_error: "Please enter a description"
  }),
  image_url: z.string({
    invalid_type_error: "Please enter an image URL"
  }),
  enemies: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string(),
    maxhp: z.number(),
    special: z.array(z.any()),  // Adjust this according to the actual structure of the special array
    amount: z.number()
  })),
  turnOrder: z.array(z.string()),
  players: z.array(z.object({
    id: z.string(),
    image_url: z.string(),
    name: z.string(),
    level: z.number(),
    maxHP: z.number(),
    hp: z.number(),
    xp: z.number(),
    caps: z.number(),
    origin: z.string(),
    special: z.array(z.any()),  // Adjust this according to the actual structure of the special array
    defense: z.number(),
    weapons: z.array(z.any()),  // Adjust this according to the actual structure of the weapons array
    amount: z.number()
  })),
  locations: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image_url: z.string(),
    quests: z.array(z.any()),  // Adjust this according to the actual structure of the quests array
    amount: z.number()
  }))
});


const CreateBattle = FormSchema;

export type State = {
    errors?: {
      title?: string;
      description?: string;
      image_url?: string;
      turnOrder?: string[];
      enemies?: string[];
      players?: string[];
      locations?: string[];
    };
    message?: string | null;
  };

  export async function createBattle(prevState: State, formData: any) {
    //Validate using Zod
    console.log('CREATING BATTLEEEEEEEEEEEEEEEEEE:', formData);
    const validatedFields = CreateBattle.safeParse({
      locations: formData.locations,
      title: formData.name, // Switched from name to title for naming convention
      description: formData.description,
      image_url: `/battles/` + formData.image_url,
      turnOrder: formData.turnOrder,
      enemies: formData.enemies,
      players: formData.players
    })

    console.log('VALIDATED FIELDS:', validatedFields)

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      console.log('ERRORS:', validatedFields.error.flatten().fieldErrors);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Battle.',
      };
    }

    // Prepare data for insertion into the database
    const { title, description, image_url, turnOrder, enemies, players, locations } = validatedFields.data;
    const id = generateUUID();
    const now = new Date();
    const date = now.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
    const dateTime = `${date} ${time}`;
    
    // Insert data into the database
    // Format arrays as Postgres array literals
    const formattedTurnOrder = `{${turnOrder.map(item => `"${item}"`).join(',')}}`;
    const formattedEnemies = `{${enemies.map(enemy => `"${enemy.id}"`).join(',')}}`;
    const formattedPlayers = `{${players.map(player => `"${player.id}"`).join(',')}}`;

    console.log(`
    INSERT INTO battles (id, title, date, description, image_url, turnOrder, turn, enemies, players, template)
    VALUES (${id}, ${title}, ${date}, ${description}, ${image_url}, ${formattedTurnOrder}, ${0}, ${formattedEnemies}, ${formattedPlayers}, ${false})
    ON CONFLICT (id) DO NOTHING;
    `);

    try {
        await sql`
            INSERT INTO battles (id, title, date, description, image_url, turnOrder, turn, enemies, players, template)
            VALUES (${id}, ${title}, ${date}, ${description}, ${image_url}, ${formattedTurnOrder}, ${0}, ${formattedEnemies}, ${formattedPlayers}, ${false})
            ON CONFLICT (id) DO NOTHING;
        `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        console.log('ERROR:', error);
        return {
            message: 'Database Error: Failed to Create Battle.',
        };
    }

  
    // Revalidate the cache for the combat page and redirect the user.
    revalidatePath('/dashboard/combat/new');
    redirect('/dashboard/combat');
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }