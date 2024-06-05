  import { lusitana } from '@/app/ui/fonts';
  import { fetchPlayers } from '@/app/lib/data';
  import ProfileCard from '@/app/ui/players/profile';
  
  export default async function CardWrapper() {
    try {
      const profiles  = await fetchPlayers();
      console.log('Profiles:', profiles);
  
      return (
        <div className="flex">
          {profiles && profiles.map((profile) => (
            <ProfileCard key={profile.id} name={profile.name} level={profile.level} xp={profile.xp} caps={profile.caps} origin={profile.origin} special={profile.special} defense={profile.defense} weapons={[]} maxHP={14} hp={10} image_url={profile.image_url} rads={2} />
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error in CardWrapper:', error);
      return <div>Error loading player data</div>;
    }
  }
  