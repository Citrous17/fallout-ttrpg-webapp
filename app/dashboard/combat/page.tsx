import Combat from '@/app/ui/combat/Combat';
import { Suspense } from 'react';
import { fetchUserWeapons, populateEnemyCards, populatePlayerCards, fetchBattleProgress, fetchEnemyById, fetchPlayerById } from '@/app/lib/data';
import { Player, Enemy, Battle } from '@/app/lib/definitions';
import { Weapon } from '@/app/lib/definitions';
export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';
import { cookies } from 'next/headers'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';


//@remove This function is outdated and should be removed
async function populateActions(battleProgress: any) {
  
  const actions: string[] = [];
  const wrapInGreen = (text: string) => `<span class="text-green-500">${text}</span>`;
  const wrapInRed = (text: string) => `<span class="text-red-500">${text}</span>`;
  const action1 = `${wrapInGreen('Player 1')} attacks Enemy 1 for 2 damage`;
  const action2 = `${wrapInGreen('Player 1')} attacks Enemy 1 for 2 damage`;
  const action3 = `Enemy 1 attacks ${wrapInGreen('Player 1')} for 3 damage`;

  actions.push(action1);
  actions.push(action2);
  actions.push(action3);
  return actions;
}

export default async function Page() {
    const cookieStore = cookies();
    const userEmail = cookieStore.get('email') || ''; // Provide a default value of an empty string if userEmail is undefined
    console.log('EMAIL:', userEmail ? userEmail.value : 'No email found');
    const { battleProgress } = await fetchBattleProgress();
    const userWeapons = await fetchUserWeapons(userEmail ? userEmail.value : 'No email found'); // Convert userEmail to a string
    const enemyCards = await populateEnemyCards(battleProgress[0]);
    const playerCards = await populatePlayerCards(battleProgress[0]);
    const actions = await populateActions(battleProgress[0]);
    const admin = cookies().get('admin')?.value === 'true' ? true : false;

    return (
      <>
          <h1 className="text-2xl font-semibold mb-6">Combat: </h1>
          <audio src="/audio/FO4_RiseAndPrevail.ogg" autoPlay loop />
          <div>
              <Combat admin={admin} UserWeapons={userWeapons[0]} BattleInfo={battleProgress[0]} enemyCards={enemyCards} playerCards={playerCards} actions={actions} />
          </div>
      </>
    );

}