
import React, { useState } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { assignMember, unassignMember } from '../../services/memberService';
import { LABEL_COLORS } from '../../constants/LABEL_COLORS';
import styles from './MemberAssigner.module.css';

export default function MemberAssigner({ card }) {
  const [isOpen, setIsOpen] = useState(false);
  const globalMembers = useBoardStore(state => state.globalMembers);
  const toggleCardMember = useBoardStore(state => state.toggleCardMember);

  // Helper determining avatar initials dynamically extracting standard formats
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Pseudo-random mapped color relying explicitly safely on character points
  const getColor = (id) => {
    const keys = Object.values(LABEL_COLORS);
    const index = id.charCodeAt(id.length - 1) % keys.length;
    return keys[index];
  };

  const handleToggle = async (member) => {
    const isAttached = card.members?.some(m => m.id === member.id);
    
    // Immediate Zustand Update mirroring Database natively
    toggleCardMember(card.id, member);

    try {
      if (isAttached) {
        await unassignMember(card.id, member.id);
      } else {
        await assignMember(card.id, member.id);
      }
    } catch (err) {
      toggleCardMember(card.id, member);
      alert('Failed to execute member assignment constraint over the network.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionHeader}>Members</h3>
      
      <div className={styles.attachedMembers}>
        {card.members?.map((mbr) => (
          <div 
            key={mbr.id} 
            className={styles.avatar} 
            style={{ backgroundColor: getColor(mbr.id) }}
            title={mbr.name}
          >
            {getInitials(mbr.name)}
          </div>
        ))}
        <button className={styles.addButton} onClick={() => setIsOpen(!isOpen)}>
          +
        </button>
      </div>

      {isOpen && (
        <>
          <div className={styles.popoverOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.popoverMenu}>
            <div className={styles.popoverHeader}>
              <span>Members</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <div className={styles.membersList}>
              {globalMembers.map(member => {
                const isActive = card.members?.some(m => m.id === member.id);
                return (
                  <div 
                    key={member.id} 
                    className={styles.memberOption}
                    onClick={() => handleToggle(member)}
                  >
                    <div className={styles.avatar} style={{ backgroundColor: getColor(member.id) }}>
                      {getInitials(member.name)}
                    </div>
                    <span className={styles.memberName}>{member.name}</span>
                    {isActive && <span className={styles.checkIcon}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
