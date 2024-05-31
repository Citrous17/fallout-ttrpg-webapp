import React from "react";
import styles from '@/app/ui/players/profile.module.css';
import Image from 'next/image';
import { Weapon } from '@/app/lib/definitions';
interface ProfileCardProps {
    name: string;
    image_url: string;
    level: number;
    maxHP: number;
    rads: number;
    hp: number;
    xp: number;
    caps: number;
    origin: string;
    special: number[];
    defense: number;
    weapons: Weapon[];
}

function ProfileCard(props: ProfileCardProps) {
    const xpPercentage = (props.xp % 100);
    const healthPercentage = (props.hp / props.maxHP) * 100;
    const radsPercentage = (props.rads / props.maxHP) * 100;
    
    return (
        <div className="pr-2">
          <div className="bg-white shadow-md rounded-lg p-4 max-w-sm">
            <header className="flex justify-center mb-4">
              <Image
                className="rounded-full border-4 border-gray-300"
                src={props.image_url}
                alt="Profile Picture"
                width={100}
                height={100}
              />
            </header>
            <h1 className="text-xl font-bold text-gray-900">
              {props.name} <span className="text-lg font-normal text-gray-600">{props.level}</span>
            </h1>
            <p className="text-gray-600">Health: ({props.hp}/{props.maxHP})</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 relative">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4 flex">
                  <div
                    className="bg-red-500 h-4 rounded-l-full"
                    style={{ width: `${healthPercentage}%` }}
                  ></div>
                  <div
                    className="bg-green-500 h-4 rounded-r-full absolute right-0"
                    style={{ width: `${radsPercentage}%` }}
                  ></div>
                </div>
              </div>
            <p className="text-gray-600">{props.xp} XP</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${xpPercentage}%` }}
                ></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-gray-800 font-bold">
                <span>S.</span>
                <span>P.</span>
                <span>E.</span>
                <span>C.</span>
                <span>I.</span>
                <span>A.</span>
                <span>L.</span>
              </div>
              <div className="flex justify-between text-gray-800 mt-2">
                <span>{props.special[0]}</span>
                <span>{props.special[1]}</span>
                <span>{props.special[2]}</span>
                <span>{props.special[3]}</span>
                <span>{props.special[4]}</span>
                <span>{props.special[5]}</span>
                <span>{props.special[6]}</span>
              </div>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-gray-800 font-bold">
                    <span>Defense:</span>
                    <span>{props.defense}</span>
                </div>
                <div className="flex justify-between text-gray-800 mt-2">
                    <span>Caps:</span>
                    <span>{props.caps}</span>
                </div>
                <div className="flex justify-between text-gray-800 mt-2">
                    <span>Origin:</span>
                    <span>{props.origin}</span>
                </div>
            </div>
          </div>
        </div>
      );
}

export default ProfileCard;