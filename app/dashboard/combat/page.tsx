import Combat from '@/app/ui/combat/Combat';
import { fetchActions, fetchUserWeapons, populateEnemyCards, populatePlayerCards, fetchBattleProgress, fetchEnemyById, fetchPlayerById } from '@/app/lib/data';
export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';
import { cookies } from 'next/headers'

export default async function Page() {
    const cookieStore = cookies();
    const userEmail = cookieStore.get('email') || ''; // Provide a default value of an empty string if userEmail is undefined
    const { battleProgress } = await fetchBattleProgress();
    
    if(battleProgress.length === 0){
      return (
          <h1 className="text-2xl font-semibold">No battle in progress</h1>
      );
    } else {
    const userWeapons = await fetchUserWeapons(userEmail ? userEmail.value : 'No email found'); // Convert userEmail to a string
    const enemyCards = await populateEnemyCards(battleProgress[0]);
    const playerCards = await populatePlayerCards(battleProgress[0]);
    const actions = await fetchActions(battleProgress[0]);
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
}