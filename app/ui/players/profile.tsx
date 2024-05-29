import React from "react";
import styles from '@/app/ui/players/profile.module.css';
import Image from 'next/image';

interface ProfileCardProps {
    name: string;
    level: number;
}

function ProfileCard(props: ProfileCardProps) {
    return (
        <div className="pr-2">
            <div className={styles.cardContainer}>
                <header>
                    <Image className={styles.img} src="/customers/amy-burns.png" alt="Profile Picture" width={100} height={100} />
                </header>
                <h1 className={styles.boldText}>
                    {props.name} <span className={styles.normalText}>{props.level}</span>
                </h1>
            </div>
        </div>
    );
}

export default ProfileCard;